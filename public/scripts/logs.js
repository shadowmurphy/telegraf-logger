// public/scripts/logs.js

document.addEventListener('DOMContentLoaded', () => {
  const levelsSelect = document.getElementById('levels');
  const startTimeInput = document.getElementById('start-time');
  const endTimeInput = document.getElementById('end-time');
  const searchInput = document.getElementById('search');
  const logsContainer = document.getElementById('logs');
  const pauseButton = document.getElementById('pause');
  const resumeButton = document.getElementById('resume');
  const exportButton = document.getElementById('export');
  const autoscrollCheckbox = document.getElementById('autoscroll');
  const darkModeCheckbox = document.getElementById('dark-mode');
  const setLogLevelSelect = document.getElementById('set-log-level');
  const moduleTagInput = document.getElementById('module-tag');
  const exportFormatSelect = document.getElementById('export-format');
  const regexSearchCheckbox = document.getElementById('regex-search');
  const saveFilterButton = document.getElementById('save-filter');
  const savedFiltersSelect = document.getElementById('saved-filters');

  let logs = [];
  let paused = false;
  let autoscroll = true;
  let logChart;

  if (paused) {
    pauseButton.disabled = true;
    resumeButton.disabled = false;
  } else {
    pauseButton.disabled = false;
    resumeButton.disabled = true;
  }

  // Load saved filters from localStorage
  let savedFilters = JSON.parse(localStorage.getItem('savedFilters') || '[]');
  // Initialize WebSocket
  const socket = new WebSocket(`ws://${window.location.host}`);

  socket.addEventListener('open', () => {
    console.log('WebSocket connection established');
  });

  socket.addEventListener('message', (event) => {
    if (paused) return;

    const log = JSON.parse(event.data);
    logs.push(log);

    if (filterLog(log)) {
      addLogToDOM(log);
      updateChart(log);
    }
  });

  socket.addEventListener('close', () => {
    console.log('WebSocket connection closed');
  });

  socket.addEventListener('error', (err) => {
    console.error('WebSocket error:', err);
  });

  // Fetch existing logs on page load
  fetch('/logs-data')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        logs = data.logs;
        refreshLogs();
      } else {
        console.error('Failed to load existing logs:', data.error);
      }
    })
    .catch(err => {
      console.error('Error fetching existing logs:', err);
    });

  // Initialize Chart.js chart
  const chartCanvas = document.getElementById('log-chart').getContext('2d');

  function initializeChart() {
    const chartData = {
      labels: [], // Timestamps
      datasets: [
        {
          label: 'Error',
          data: [],
          borderColor: '#dc3545',
          fill: false,
        },
        {
          label: 'Warn',
          data: [],
          borderColor: '#fd7e14',
          fill: false,
        },
        {
          label: 'Info',
          data: [],
          borderColor: '#28a745',
          fill: false,
        },
        {
          label: 'Verbose',
          data: [],
          borderColor: '#007bff',
          fill: false,
        },
        {
          label: 'Debug',
          data: [],
          borderColor: '#17a2b8',
          fill: false,
        },
        {
          label: 'Silly',
          data: [],
          borderColor: '#6f42c1',
          fill: false,
        },
      ],
    };

    logChart = new Chart(chartCanvas, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              parser: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
              tooltipFormat: 'll HH:mm:ss',
              displayFormats: {
                millisecond: 'HH:mm:ss.SSS',
                second: 'HH:mm:ss',
                minute: 'HH:mm',
                hour: 'HH',
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }

  initializeChart();

  // Update the chart when new logs arrive
  function updateChart(log) {
    const timestamp = new Date(log.timestamp);
    const levelIndex = {
      'error': 0,
      'warn': 1,
      'info': 2,
      'verbose': 3,
      'debug': 4,
      'silly': 5,
    }[log.level];

    // Update datasets
    const dataset = logChart.data.datasets[levelIndex];
    dataset.data.push({ x: timestamp, y: 1 });

    // Keep the last 100 data points
    if (dataset.data.length > 100) {
      dataset.data.shift();
    }

    // Update chart labels
    logChart.update();
  }

  function addLogToDOM(log) {
    const logItem = document.createElement('li');
    logItem.classList.add(log.level);
    logItem.textContent = `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`;
    logItem.addEventListener('click', () => {
      alert(JSON.stringify(log, null, 2));
    });
    logsContainer.appendChild(logItem);

    if (autoscroll) {
      logItem.scrollIntoView();
    }
  }

  function filterLog(log) {
    // Filter by levels
    const selectedLevels = Array.from(levelsSelect.selectedOptions).map(opt => opt.value);
    if (!selectedLevels.includes(log.level)) {
      return false;
    }

    // Filter by time range
    const logTime = new Date(log.timestamp);
    if (startTimeInput.value) {
      const startTime = new Date(startTimeInput.value);
      if (logTime < startTime) return false;
    }
    if (endTimeInput.value) {
      const endTime = new Date(endTimeInput.value);
      if (logTime > endTime) return false;
    }

    // Filter by module tag
    const moduleTag = moduleTagInput.value.trim().toLowerCase();
    if (moduleTag && (!log.module || log.module.toLowerCase() !== moduleTag)) {
      return false;
    }

    // Filter by search term or regex
    const searchTerm = searchInput.value;
    if (searchTerm) {
      if (regexSearchCheckbox.checked) {
        try {
          const regex = new RegExp(searchTerm, 'i');
          if (!regex.test(log.message)) {
            return false;
          }
        } catch (e) {
          // Invalid regex
          return false;
        }
      } else {
        if (!log.message.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
      }
    }

    return true;
  }

  function refreshLogs() {
    logsContainer.innerHTML = '';
    logChart.data.datasets.forEach(dataset => dataset.data = []);
    logs.filter(filterLog).forEach(log => {
      addLogToDOM(log);
      updateChart(log);
    });
  }

  // Event listeners for filters
  levelsSelect.addEventListener('change', refreshLogs);
  startTimeInput.addEventListener('change', refreshLogs);
  endTimeInput.addEventListener('change', refreshLogs);
  searchInput.addEventListener('input', refreshLogs);
  moduleTagInput.addEventListener('input', refreshLogs);
  regexSearchCheckbox.addEventListener('change', refreshLogs);

  // Pause and Resume functionality
  pauseButton.addEventListener('click', () => {
    paused = true;
    pauseButton.disabled = true;
    resumeButton.disabled = false;
  });

  resumeButton.addEventListener('click', () => {
    paused = false;
    resumeButton.disabled = true;
    pauseButton.disabled = false;
  });

  // Auto-Scroll Toggle
  autoscrollCheckbox.addEventListener('change', () => {
    autoscroll = autoscrollCheckbox.checked;
  });

  // Dark Mode Toggle
  darkModeCheckbox.addEventListener('change', () => {
    if (darkModeCheckbox.checked) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });

  // Export Logs
  exportButton.addEventListener('click', () => {
    const exportedLogs = logs.filter(filterLog);
    const format = exportFormatSelect.value;

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportedLogs, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'logs.json';
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const csvContent = logsToCSV(exportedLogs);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'logs.csv';
      link.click();
      URL.revokeObjectURL(url);
    }
  });

  // Function to convert logs to CSV
  function logsToCSV(logsArray) {
    if (logsArray.length === 0) return '';

    const headers = Object.keys(logsArray[0]);
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(','));

    // Add rows
    for (const log of logsArray) {
      const values = headers.map(header => {
        const escaped = ('' + log[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  // Set Logger Level
  setLogLevelSelect.addEventListener('change', () => {
    const level = setLogLevelSelect.value;
    fetch('/set-log-level', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ level }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(`Log level changed to ${level}`);
        } else {
          alert(`Failed to change log level: ${data.error}`);
        }
      })
      .catch((err) => {
        console.error('Error changing log level:', err);
      });
  });

  // Save current filter
  saveFilterButton.addEventListener('click', () => {
    const filterName = prompt('Enter a name for this filter:');
    if (filterName) {
      const filter = {
        name: filterName,
        levels: Array.from(levelsSelect.selectedOptions).map(opt => opt.value),
        startTime: startTimeInput.value,
        endTime: endTimeInput.value,
        searchTerm: searchInput.value,
        regex: regexSearchCheckbox.checked,
        moduleTag: moduleTagInput.value,
      };
      savedFilters.push(filter);
      localStorage.setItem('savedFilters', JSON.stringify(savedFilters));
      populateSavedFilters();
      alert('Filter saved!');
    }
  });


  function refreshLogs() {
    logsContainer.innerHTML = '';
    if (logChart) {
      logChart.data.datasets.forEach(dataset => dataset.data = []);
    }
    logs.filter(filterLog).forEach(log => {
      addLogToDOM(log);
      updateChart(log);
    });
    if (logChart) {
      logChart.update();
    }
  }

  // Populate saved filters dropdown
  function populateSavedFilters() {
    savedFiltersSelect.innerHTML = '<option value="">Select Saved Filter</option>';
    savedFilters.forEach((filter, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = filter.name;
      savedFiltersSelect.appendChild(option);
    });
  }

  populateSavedFilters();

  // Apply saved filter
  savedFiltersSelect.addEventListener('change', () => {
    const selectedIndex = savedFiltersSelect.value;
    if (selectedIndex !== '') {
      const filter = savedFilters[selectedIndex];
      // Apply filter settings
      Array.from(levelsSelect.options).forEach(option => {
        option.selected = filter.levels.includes(option.value);
      });
      startTimeInput.value = filter.startTime;
      endTimeInput.value = filter.endTime;
      searchInput.value = filter.searchTerm;
      regexSearchCheckbox.checked = filter.regex;
      moduleTagInput.value = filter.moduleTag;
      refreshLogs();
    }
  });
});

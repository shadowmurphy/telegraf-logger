// public/scripts/analytics.js

document.addEventListener('DOMContentLoaded', () => {
    const detailedChartCanvas = document.getElementById('detailed-chart').getContext('2d');
    const timeChartCanvas = document.getElementById('time-chart').getContext('2d');
    let detailedChart;
    let timeChart;
  
    fetch('/logs-data')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const logs = data.logs;
          renderDetailedChart(logs);
          renderTimeChart(logs);
        } else {
          console.error('Failed to load logs:', data.error);
        }
      })
      .catch(err => {
        console.error('Error fetching logs:', err);
      });
  
    function renderDetailedChart(logs) {
      const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
      const levelCounts = {};
      levels.forEach(level => {
        levelCounts[level] = 0;
      });
  
      logs.forEach(log => {
        if (levelCounts.hasOwnProperty(log.level)) {
          levelCounts[log.level]++;
        }
      });
  
      const chartData = {
        labels: levels.map(level => level.toUpperCase()),
        datasets: [{
          label: 'Log Levels Distribution',
          data: levels.map(level => levelCounts[level]),
          backgroundColor: [
            '#dc3545',
            '#fd7e14',
            '#28a745',
            '#007bff',
            '#17a2b8',
            '#6f42c1',
          ],
        }],
      };
  
      detailedChart = new Chart(detailedChartCanvas, {
        type: 'pie',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  
    function renderTimeChart(logs) {
      const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
      const timeLabels = [];
      const timeData = {};
  
      levels.forEach(level => {
        timeData[level] = [];
      });
  
      const now = new Date();
      const intervals = [];
      for (let i = 59; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000);
        const label = time.toTimeString().substr(0, 5);
        timeLabels.push(label);
        intervals.push({
          start: new Date(time.getTime()),
          end: new Date(time.getTime() + 60000),
        });
      }
  
      intervals.forEach(() => {
        levels.forEach(level => {
          timeData[level].push(0);
        });
      });
  
      logs.forEach(log => {
        const logTime = new Date(log.timestamp);
        intervals.forEach((interval, index) => {
          if (logTime >= interval.start && logTime < interval.end) {
            if (timeData[log.level]) {
              timeData[log.level][index]++;
            }
          }
        });
      });
  
      const datasets = levels.map(level => ({
        label: level.toUpperCase(),
        data: timeData[level],
        borderColor: {
          error: '#dc3545',
          warn: '#fd7e14',
          info: '#28a745',
          verbose: '#007bff',
          debug: '#17a2b8',
          silly: '#6f42c1',
        }[level],
        fill: false,
      }));
  
      const chartData = {
        labels: timeLabels,
        datasets: datasets,
      };
  
      timeChart = new Chart(timeChartCanvas, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Logs',
              },
            },
          },
        },
      });
    }
  });
  
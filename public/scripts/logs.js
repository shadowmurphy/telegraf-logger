const logsElement = document.getElementById('logs');
const levelSelect = document.getElementById('level');
const searchInput = document.getElementById('search');

const eventSource = new EventSource('/stream');

let logs = [];

eventSource.onmessage = function(event) {
  const log = JSON.parse(event.data);
  logs.push(log);
  displayLogs();
};

levelSelect.addEventListener('change', displayLogs);
searchInput.addEventListener('input', displayLogs);

function displayLogs() {
  const selectedLevel = levelSelect.value;
  const searchTerm = searchInput.value.toLowerCase();

  logsElement.innerHTML = '';

  logs
    .filter(log => {
      const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
      const matchesSearch = log.message.toLowerCase().includes(searchTerm);
      return matchesLevel && matchesSearch;
    })
    .forEach(log => {
      const logEntry = document.createElement('div');
      logEntry.classList.add('log-entry', log.level);
      logEntry.textContent = `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`;
      logsElement.appendChild(logEntry);
    });

  logsElement.scrollTop = logsElement.scrollHeight;
}

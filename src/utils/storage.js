/**
 * Export all PerDash dashboard local storage state into a downloadable JSON file
 */
export function exportDashboardData() {
  const data = {};
  const prefix = 'perdash_';

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        data[key] = localStorage.getItem(key);
      }
    }
  }

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `perdash_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import and restore dashboard state from a JSON backup file
 */
export function importDashboardData(jsonFile, onSuccess, onError) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (typeof data !== 'object' || data === null) {
        throw new Error('Invalid JSON format');
      }

      Object.entries(data).forEach(([key, val]) => {
        if (key.startsWith('perdash_')) {
          localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
        }
      });

      // Dispatch local storage update event to sync all reactive hooks
      window.dispatchEvent(new Event('local-storage-update'));
      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
    }
  };
  reader.readAsText(jsonFile);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveButton').addEventListener('click', () => {
    const key = document.getElementById('key').value;
    const site = document.getElementById('site').value.trim();

    if (validateURL(site)) {
      saveSite(key, site);
    } else {
      alert('Please enter a valid URL.');
    }
  });

  loadShortcuts();
});

function validateURL(url) {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(url);
}

function saveSite(key, site) {
  chrome.storage.sync.get('settings', (result) => {
    let settings = result.settings || { shortcuts: {} };
    settings.shortcuts[key] = site;

    chrome.storage.sync.set({ settings }, () => {
      console.log('Settings saved:', settings);
      loadShortcuts();
    });
  });
}

function loadShortcuts() {
  chrome.storage.sync.get('settings', (result) => {
    const shortcuts = result.settings?.shortcuts || {};
    const shortcutsContainer = document.getElementById('shortcuts');
    shortcutsContainer.innerHTML = '';

    for (const key in shortcuts) {
      if (shortcuts.hasOwnProperty(key)) {
        const div = document.createElement('div');
        div.className = 'shortcut';
        div.innerHTML = `
          <span>${key}: ${shortcuts[key]}</span>
          <button class="edit" data-key="${key}">Edit</button>
          <button class="remove" data-key="${key}">Remove</button>
        `;
        shortcutsContainer.appendChild(div);
      }
    }

    document.querySelectorAll('.edit').forEach(button => {
      button.addEventListener('click', (event) => {
        editShortcut(event.target.getAttribute('data-key'));
      });
    });

    document.querySelectorAll('.remove').forEach(button => {
      button.addEventListener('click', (event) => {
        removeShortcut(event.target.getAttribute('data-key'));
      });
    });
  });
}

function editShortcut(key) {
  chrome.storage.sync.get('settings', (result) => {
    const settings = result.settings;
    const url = settings.shortcuts[key];
    document.getElementById('key').value = key;
    document.getElementById('site').value = url;
  });
}

function removeShortcut(key) {
  chrome.storage.sync.get('settings', (result) => {
    const settings = result.settings;
    delete settings.shortcuts[key];

    chrome.storage.sync.set({ settings }, () => {
      console.log('Shortcut removed:', key);
      loadShortcuts();
    });
  });
}

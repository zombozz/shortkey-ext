chrome.commands.onCommand.addListener((command) => {
  chrome.storage.sync.get('settings', (result) => {
    if (result.settings && result.settings.shortcuts) {
      const shortcuts = result.settings.shortcuts;
      const url = shortcuts[command];
      
      if (url) {
        chrome.tabs.create({ url });
      } else {
        console.log(`No URL found for command: ${command}`);
      }
    } else {
      console.log('No settings found.');
    }
  });
});

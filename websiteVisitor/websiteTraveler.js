// progress.js

function updateProgress(message) {
    document.getElementById('progress').innerHTML = message;
  }


document.addEventListener('DOMContentLoaded', function () {
    // Your popup initialization code goes here
    document.getElementById('startButton').addEventListener('click', startExtension);
});

function startExtension() {
    // Your code to start the extension goes here
    // For example, you can trigger the background script to perform actions
    browser.runtime.sendMessage({ action: 'startExtension' });
}

// Listen for messages from the background script
browser.runtime.onMessage.addListener(function (message) {
  if (message.action === 'updateProgress') {
      updateProgress(message.message);
  }
});

function updateProgress(message) {
  // Update the progress message in the popup
  document.getElementById('progressMessage').textContent = message;
}


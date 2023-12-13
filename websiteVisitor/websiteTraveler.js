// progress.js

function updateProgress(message) {
    document.getElementById('progress').innerHTML = message;
  }


document.addEventListener('DOMContentLoaded', function () {
    // Your popup initialization code goes here
    console.log("DOM Content Loaded");
    document.getElementById('startButton').addEventListener('click', startTraveling);
});

function startTraveling() {
    browser.runtime.sendMessage({ action: 'startTraveling' });
}

// Listen for messages from the background script
browser.runtime.onMessage.addListener(function (message, sender, response) {
  if (message.action === 'updateProgress') {
      updateProgress(message.message);
  }
});

function updateProgress(message) {
  document.getElementById('progress').textContent = message;
}


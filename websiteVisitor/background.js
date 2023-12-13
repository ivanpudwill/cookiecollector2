let pagesToVisit = [];
let currentIndex = 0;

browser.browserAction.onClicked.addListener(function() {
    browser.windows.create({
        type: "panel",
        url: "websiteTraveler.html"
    })
})

browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "startTraveling") {
        startTraveling()
    }
})

function startTraveling() {
    // Fetch the URLs from the CSV file
    fetch(browser.runtime.getURL('websites.csv'))
    .then(response => response.text())
    .then(csvText => {
        // Parse CSV into an array of URLs
        pagesToVisit = csvText.split('\n');

        // Reset index
        currentIndex = 0;

        // Add the tabs.onUpdated listener when the extension is activated
        browser.tabs.onUpdated.addListener(onTabUpdated);

        // Open the first page
        browser.tabs.create({ url: pagesToVisit[currentIndex] });
    });
}

//get active tab
function getActiveTab() {
    return browser.tabs.query({currentWindow: true, active: true});
}

function onTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
        getActiveTab().then(visitNextPage(tabId))
    }
}

function updateProgress(message) {
    browser.runtime.sendMessage({action: 'updateProgress', message: message})
}

function visitNextPage(tabId) {
    currentIndex++;
    console.log(currentIndex)
    
    const progressMessage = `Page ${currentIndex + 1} of ${pagesToVisit.length}`;
    
    updateProgress(progressMessage);
    
    if (currentIndex < pagesToVisit.length) {
        browser.tabs.update(tabId, { url: pagesToVisit[currentIndex] });
    } else {
        // All pages visited
        currentIndex = 0;
        updateProgress('All pages visited');
        browser.tabs.onUpdated.removeListener(onTabUpdated);
    }
}
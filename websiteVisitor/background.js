let pagesToVisit = [];
let currentIndex = 0;
let searchTabID = 22;

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
        browser.tabs.create({ url: pagesToVisit[currentIndex], active: true});
    });
}


function onTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && changeInfo.url !== tab.url) {
        visitNextPage(tabId, tab)
    }
}

function updateProgress(message) {
    browser.runtime.sendMessage({action: 'updateProgress', message: message})
}

function visitNextPage(tabId, tab) {
    currentIndex++;

    console.log("Webpage number " + currentIndex + " at url " + tab.url)
    
    const progressMessage = `Page ${currentIndex} of ${pagesToVisit.length}`;
    
    updateProgress(progressMessage);
    console.log("\t" + progressMessage)
    if (currentIndex < pagesToVisit.length) {
        browser.tabs.update(tabId, { url: pagesToVisit[currentIndex], active: true});
    } else {
        // All pages visited
        currentIndex = 0;
        updateProgress('All pages visited');
        browser.tabs.onUpdated.removeListener(onTabUpdated);
        return;
    }
}
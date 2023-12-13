let pagesToVisit = [];
let currentIndex = 0;
let progressWindowTabId = null;
let extensionActivated = false;

function openProgressWindow() {
    browser.windows.create({
        url: browser.runtime.getURL('progress.html'),
        type: 'popup',
        width: 400,
        height: 200,
        focused: true
    }, function (window) { progressWindowTabId = window.tabs[0].id; })
}

function closeProgressWindow() {
    if (progressWindowTabId !== null) {
        browser.windows.remove(progressWindowTabId);
        progressWindowTabId = null;
    }
    console.log("Closing Project Window")
}

function updateProgress(message) {
    if (progressWindowTabId !== null) {
        browser.tabs.update(progressWindowTabId, { active: true }, function () {
            browser.tabs.sendMessage(progressWindowTabId, { message: message });
        });
    }
  }

function visitNextPage(tabId) {
    currentIndex++;
    console.log(currentIndex)
    
    const progressMessage = `Page ${currentIndex + 1} of ${pagesToVisit.length}`;
    
    updateProgress(progressMessage);

    //pagesToVisit.length
    if (currentIndex < pagesToVisit.length) {
        browser.tabs.update(tabId, { url: pagesToVisit[currentIndex] });
    } else {
        // All pages visited
        currentIndex = 0;
        updateProgress('All pages visited');
        // close the progress window
        closeProgressWindow();
    }
  }

function activateExtension() {
    extensionActivated = true;

    console.log("extension activated")

    // Add the tabs.onUpdated listener when the extension is activated
    browser.tabs.onUpdated.addListener(onTabUpdated);
}

function deactivateExtension() {
    extensionActivated = false;

    browser.tabs.onUpdated.removeListener(onTabUpdated);
}

function onTabUpdated(tabId, changeInfo, tab) {
    console.log("onUpdated event listener created")
    if (extensionActivated && changeInfo.statues === "complete") {
        if (tabId === progressWindowTabId) {
            return; // ignore the project window
        }
        getActiveTab().then(() => visitNextPage(tabId))
    }
}

//get active tab
function getActiveTab() {
    return browser.tabs.query({currentWindow: true, active: true});
}

// Fetch the URLs from the CSV file
fetch(browser.runtime.getURL('websites.csv'))
    .then(response => response.text())
    .then(csvText => {
        // Parse CSV into an array of URLs
        pagesToVisit = csvText.split('\n');

        // Initialize visit when the browser action button is clicked
        browser.browserAction.onClicked.addListener(function (tab) {
            // Reset index
            currentIndex = 0;
            activateExtension()

            openProgressWindow();
            console.log("Opening Progress Window")

            // Open the first page
            browser.tabs.create({ url: pagesToVisit[currentIndex] });
        });
    });

browser.browserAction.onClicked.addListener(function() {
    browser.windows.create({
        type: "panel",
        url: "websiteTraveler.html"
    })
})


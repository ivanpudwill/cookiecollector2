browser.browserAction.onClicked.addListener(function() {
    browser.windows.create({
        type: "panel",
        url: "cookies.html"
    })
})

//get active tab
function getActiveTab() {
    return browser.tabs.query({currentWindow: true, active: true});
}

function getCookies(tabs) {
        // get first active tab
        let tab = tabs.pop();

        // get all cookies
        let allCookies = browser.cookies.getAll({}, function(cookies) {
            browser.runtime.sendMessage({action: 'updateCookies', cookies: cookies, tabTitle: tab.title});
        });
}

//Check for a new page loading
browser.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status == "complete") {
        getActiveTab().then(getCookies);
    }
});


browser.tabs.onActivated.addListener(function (activeInfo) {
    getActiveTab().then(getCookies);
});



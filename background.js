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

        // get cookies on current tab
        let cookies = browser.cookies.getAll({url : tab.url}, function(cookies) {
            browser.runtime.sendMessage({action: 'updateCookies', cookies: cookies, tabTitle: tab.title});
        });

        // get all cookies
        let allCookies = browser.cookies.getAll({}, function(cookies) {
            browser.runtime.sendMessage({action: 'updateAllCookies', cookies: cookies});
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

function deleteAllCookies() {
    // use promises to ensure we don't update the cookie tables until all cookies are deleted
    return new Promise((resolve) => {
        browser.cookies.getAll({}, function (cookies) {
            const promises = cookies.map((cookie) => {
                const param = {
                    url: (cookie.secure ? 'https://' : 'http://') + cookie.domain + cookie.path,
                    name: cookie.name,
                };
                return browser.cookies.remove(param);
            });

            Promise.all(promises).then(() => {
                resolve();
            });
        });
    });
}

browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "ClearCookies") {
        deleteAllCookies().then(() => {
            // Update cookies after deletion is complete
            getActiveTab().then(getCookies);
        });
    }
});

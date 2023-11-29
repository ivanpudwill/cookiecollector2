
// get Cookies
function showCookiesForTab(tabs) {
    // get first active tab
    let tab = tabs.pop();

    // get all cookies
    let allCookies = browser.cookies.getAll({});

    allCookies.then((cookies) => {
        console.log("Retrieved Cookies:", cookies);
        updateCookieInfo(cookies, tab.title);
    });
}

// update the cookies in the sidebar 
function updateCookieInfo(cookies, tabTitle) {
    let activeTabUrl = $('#header-title');
    activeTabUrl.html("Cookies at: " + tabTitle);

    let cookieTable = $('#cookie-list').DataTable();
    cookieTable.clear();

    if (cookies.length > 0) {
        for (let cookie of cookies) {
            cookieTable.row.add([cookie.name, cookie.value]).draw();
        }
    } else {
        cookieTable.row.add(["No cookies in this tab.", ""]).draw();
    }
}

//get active tab
function getActiveTab() {
    return browser.tabs.query({currentWindow: true, active: true});
}

// Load DataTable when the tab is updated
browser.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status == "complete") {
        getActiveTab().then(showCookiesForTab);
    }
});

// Initialize DataTable when the document is ready
$(document).ready(function () {
    $('#cookie-list').DataTable();
});



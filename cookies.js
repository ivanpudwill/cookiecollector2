function updateCookieInfo(cookies, tabTitle) { 
    let activeTabUrl = document.getElementById('header-title');
    let text = document.createTextNode("Cookies at: " + tabTitle);

    // Clear existing content before adding new content
    activeTabUrl.innerHTML = "";
    activeTabUrl.appendChild(text);

    let cookieTable = document.getElementById('cookie-list');
    
    //clear rows in table)
    cookieTable.innerHTML = "";

    if (cookies.length > 0) {
        for (let cookie of cookies) {
            let row = cookieTable.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            cell1.innerHTML = cookie.name;
            cell2.innerHTML = cookie.value;
        }
    } else {
        let row = cookieTable.insertRow();
        let cell = row.insertCell(0);
        cell.colSpan = 2;
        cell.innerHTML = "No cookies in this tab.";
    }

}

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
  
//get active tab to run an callback function.
//it sends to our callback an array of tab objects
function getActiveTab() {
    return browser.tabs.query({currentWindow: true, active: true});
}

// load cookies when the tab is updated
browser.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.status == "complete") {
        getActiveTab().then(showCookiesForTab);
    }
})  
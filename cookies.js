function showCookiesForTab(tabs) {
    //get the first tab object in the array
    let tab = tabs.pop();

    //get all cookies in the domain
    let gettingAllCookies = browser.cookies.getAll({url: tab.url});
    gettingAllCookies.then((cookies) => {
    console.log("Retrieved cookies:", cookies);
    //set the header of the panel
    let activeTabUrl = document.getElementById('header-title');
    let text = document.createTextNode("Cookies at: "+tab.title);
    activeTabUrl.appendChild(text);
    
    let cookieTable = document.getElementById('cookie-table');
    
    if (cookies.length > 0) {
        for (let cookie of cookies) {
            let row = cookieTable.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            cell1.innerHTML = cookie.name;
            cell2.innerHTML - cookie.value;
        }
    } else {
        let row = cookieTable.insertRow();
        let cell = row.insertCell(0);
        cell.colSpan = 2;
        cell.innerHTML = "No cookies in this tab.";
    }
    });
  }
  
  //get active tab to run an callback function.
  //it sends to our callback an array of tab objects
  function getActiveTab() {
    return browser.tabs.query({currentWindow: true, active: true});
  }

  getActiveTab().then(showCookiesForTab);
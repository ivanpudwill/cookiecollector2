browser.runtime.onMessage.addListener(function(message,sender, sendResponse) {
    // update cookies at current url
    if (message.action === 'updateCookies') {
        updateCookieInfo(message.cookies, message.tabTitle);
    }
    if (message.action === 'updateAllCookies') {
        updateFullCookieInfo(message.cookies);
    }
});


// update the list of cookies at the current url
function updateCookieInfo(cookies, tabTitle) {
    let activeTabUrl = $('#header-title');
    activeTabUrl.html("Current Site " + tabTitle);

    cookieTable.clear();

    if (cookies.length > 0) {
        for (let cookie of cookies) {
            cookieTable.row.add([cookie.name, cookie.domain, cookie.value,cookie.expirationDate]).draw();
        }
    } else {
        cookieTable.row.add(["No cookies in this tab.", ""]).draw();
    }
}

//update the list of all cookies
function updateFullCookieInfo(cookies) {
   fullCookieTable.clear()
    if (cookies.length > 0) {
        for (let cookie of cookies) {
            fullCookieTable.row.add([cookie.name, cookie.domain, cookie.value, cookie.expirationDate]).draw();
        }
    } else {
        fullCookieTable.row.add(["There are no cookies stored.", ""]).draw();
    }
}



// Initialize DataTable when the document is ready
$(document).ready(function () {
    cookieTable = $('#domain-cookie-list').DataTable(tbl_opts);
    fullCookieTable = $('#full-cookie-list').DataTable(tbl_opts);
});

var tbl_opts = {
    "order": [[1, "asc"]],
    "columnDefs": [
        { "targets": '_all', "white-space": "nowrap", "overflow": "hidden" }
    ],
    "columns": [
        { "title": "Name",
            "width": "16%", 
            "targets": 0,
            "render": function(data) { return data || ""; }
        },
        { "title": "Domain",
            "width": "20%", 
            "targets": 1,
            "render": function(data) { return data || ""; }
        },
        { "title": "Value",
            "width": "44%", 
            "targets": 2,
            "render": function(data) { return data || ""; }
        },
        { "title": "Expiration Date",
            "width": "20%",
            "targets": 3,
            "render": function(data){
                return moment.unix(data).format("LTS L")
            }
        }]
}
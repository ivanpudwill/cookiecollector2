browser.runtime.onMessage.addListener(function(message,sender, sendResponse) {
    if (message.action === 'updateCookies') {
        updateCookieInfo(message.cookies, message.tabTitle);
    }
});

// update the cookies in the sidebar 
function updateCookieInfo(cookies, tabTitle) {
    console.log(cookies)
    let activeTabUrl = $('#header-title');
    activeTabUrl.html("Current Site " + tabTitle);

    let cookieTable = $('#cookie-list').DataTable({
        "columns": [
            { "width": "15%", "targets": 0 },
            { "width": "30%", "targets": 1 },
            { "width": "50%", "targets": 2 },
            { "width": "5%", "targets": 3 }
        ],
        "columnDefs": [
            { "targets": '_all', "white-space": "nowrap", "overflow": "hidden" }
        ]
    });
    cookieTable.clear();

    if (cookies.length > 0) {
        for (let cookie of cookies) {
            cookieTable.row.add([cookie.name, cookie.domain, cookie.value,cookie.expirationDate]).draw();
        }
    } else {
        cookieTable.row.add(["No cookies in this tab.", ""]).draw();
    }
}

// Initialize DataTable when the document is ready
$(document).ready(function () {
    $('#cookie-list').DataTable({
        "columns": [
            { "width": "15%", "targets": 0 },
            { "width": "30%", "targets": 1 },
            { "width": "50%", "targets": 2 },
            { "width": "5%", "targets": 3 }
        ],
        "columnDefs": [
            { "targets": '_all', "white-space": "nowrap", "overflow": "hidden" }
        ]
    });
});



browser.runtime.onMessage.addListener(function(message,sender, sendResponse) {
    // update cookies at current url
    console.log("Received message: " + message.action);
    if (message.action === 'updateCookies') {
        updateCookieInfo(message.cookies, message.tabTitle);
    }
    if (message.action === 'updateAllCookies') {
        updateFullCookieInfo(message.cookies);
    }
    if (message.action === 'downloadAllCookies') {
        downloadAllCookies(message.cookies);
    }
});


/** A function to run in the developer console to download the cookie info with all of it's fields*/
function downloadAllCookies(cookies) {
    var jsonString = JSON.stringify(cookies);
    var blob = new Blob([jsonString], { type: 'application/json' });

    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = "cookieJSON";
    document.body.appendChild(link);
    link.click()
}

// update the list of cookies at the current url
function updateCookieInfo(cookies, tabTitle) {
    let activeTabUrl = $('#header-title');
    activeTabUrl.html(tabTitle);

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

    // Download cookies when the button is clicked
    $('#DownloadCookies').on('click', function() {
        exportTableToCsv('cookies' + moment.unix(Date.now()).format() + '.csv', fullCookieTable);
    });
});

 // Function to export DataTable to CSV
function exportTableToCsv(filename, table) {
    var csv = [];
    var rows = table.rows().data();

    // Header
    var header = table.columns().header().toArray().map(function(column) {
        return $(column).text().trim();
    });
    csv.push(header.join(','));

    // Rows
    rows.each(function(row) {
        var rowData = row.map(function(cellData) {
            return '"' + cellData + '"';
        });
        csv.push(rowData.join(','));
    });

    // Create a Blob and trigger download
    var blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

var tbl_opts = {
    "order": [[1, "asc"]],
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
        }],
    paging: true,
    lengthChange: false,
    searching: false,
    ordering: true,
    info: false,
    autoWidth: true
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('ClearCookies').addEventListener('click', function() {
        browser.runtime.sendMessage({action: "ClearCookies"});
    
    })
    document.getElementById('DownloadCookies').addEventListener('click', function() {
        browser.runtime.sendMessage({action: "DownloadCookies"});
    })
})



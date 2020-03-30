console.log('bg starting')
chrome.runtime.onInstalled.addListener(function () {
    console.log('starting')
    chrome.storage.sync.set({ chooseColor: '#3aa757' }, function () {
        console.log("The color is set.");
    });

    // A generic onclick callback function.
    function genericOnClick(info, tab) {
        console.log("item " + info.menuItemId + " was clicked");
        console.log("info: " + JSON.stringify(info));
        console.log("tab: " + JSON.stringify(tab));
    }

    console.log(chrome, chrome.contextMenus)

    // Create one test item for each context type.
    var contexts = ["all"];
    for (var i = 0; i < contexts.length; i++) {
        var context = contexts[i];
        var title = "Test '" + context + "' menu item";
        var id = chrome.contextMenus.create({
            id: "all",
            "title": title, "contexts": [context],
            // "onclick": genericOnClick
        });
        console.log("'" + context + "' item:" + id);
    }
    chrome.contextMenus.onClicked.addListener(genericOnClick)
});

chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: 'developer.chrome.com' },
            })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
});



console.log('bg starting')
chrome.runtime.onInstalled.addListener(function () {
    console.log('starting')
    chrome.storage.sync.set({ chooseColor: '#3aa757' }, function () {
    });
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



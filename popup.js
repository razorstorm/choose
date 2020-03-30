// TODO:
// crawl through children tree, and sort through _all_ bookmarks. Just do a flatMap
// context menu

// let changeColor = document.getElementById('changeColor');

// changeColor.onclick = async function (element) {
//     // li.append(dumpTreeNodes(bookmarkNode.children, query));
//     // dumpBookmarks("Karen");
// };

// Traverse the bookmark tree, and print the folder and nodes.
function openRandom(query) {
    chrome.bookmarks.getTree(
        function (bookmarkTreeNodes) {
            const queriedChildren = grabFolderNodes(query, bookmarkTreeNodes[0].children[0].children)[0].children
            queriedChildren.forEach(child => console.log(child));

            const randomChild = queriedChildren[Math.floor(Math.random() * queriedChildren.length)];
            console.log('RANDOM WAS', randomChild.title);
            chrome.tabs.create({
                url: randomChild.url
            })
        }
    );
}

async function grabAllBookmarkFolders() {
    var bookmarkTreeNodes = await chrome.bookmarks.getTree()

    const folders = bookmarkTreeNodes[0].children[0].children;
    return folders.filter(node => node.children)
}

function grabFolderNodes(query, bookmarkNodes) {
    return bookmarkNodes.filter(node => {
        let hasQuery = !query || String(node.title).toLowerCase().indexOf(query.toLowerCase()) !== -1
        return node.children && hasQuery;
    })
}
function dumpTreeNodes(bookmarkNodes, query) {
    var list = $('<ul>');
    var i;
    for (i = 0; i < bookmarkNodes.length; i++) {
        list.append(dumpNode(bookmarkNodes[i], query));
    }
    return list;
}

document.addEventListener('DOMContentLoaded', async function () {
    // dumpBookmarks("Karen");
    const results = await grabAllBookmarkFolders();
    console.log(results);
    results.forEach(result => {
        $('#buttons').append(`<button class="bookmark" style="width: 200px" key="${result.title}">${result.title}</button>`);
    });

    const bookmarkButtons = document.getElementsByClassName('bookmark');
    console.log(bookmarkButtons)

    for (let item of bookmarkButtons) {
        console.log(item);
        item.onclick = async function (element) {
            console.log(element.target, element.target.attributes.key.value);
            openRandom(element.target.attributes.key.value);
        }
    }
});

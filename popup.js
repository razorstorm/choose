const MAX_TRIES = 10;

// Traverse the bookmark tree, and print the folder and nodes.
async function openRandom(query) {
    const bookmarkTreeNodes = await chrome.bookmarks.getTree();
    const queriedNode = grabFolderNodes(query, bookmarkTreeNodes[0].children[0].children)[0]
    const queriedChildren = crawlTree(queriedNode);
    const key = `lastChild:${query}`;

    let last = await chrome.storage.sync.get(key)
    console.debug("last randomed:", last, last[key]);

    let randomChild;
    let found = false;
    let tries = 0;
    do {
        randomChild = queriedChildren[Math.floor(Math.random() * queriedChildren.length)];
        console.debug('RANDOM WAS', randomChild.url, 'last was:', last, last[key]);
        if (randomChild && (!last || last[key] !== randomChild.url)) {
            found = true
        }
        tries++;
    } while (!found && tries < MAX_TRIES);

    const update = {}
    update[key] = randomChild.url;
    await chrome.storage.sync.set(update);

    console.debug("FOUND:" + randomChild.title)
    console.debug("----------------------------------");
    chrome.tabs.create({
        url: randomChild.url
    });
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

function crawlTree(root) {
    let results = [];
    let toSee = [root];
    while (toSee && toSee.length > 0) {
        let element = toSee.pop();
        if (element) {
            if (!element.children || element.children.length === 0) {
                results.push(element);
            } else {
                toSee = [...toSee, ...element.children];
            }
        }
    }
    return results
}

document.addEventListener('DOMContentLoaded', async function () {
    const results = await grabAllBookmarkFolders();
    results.forEach(result => {
        $('#buttons').append(`<button class="bookmark" style="width: 200px" key="${result.title}">${result.title}</button>`);
    });

    const bookmarkButtons = document.getElementsByClassName('bookmark');

    for (let item of bookmarkButtons) {
        item.onclick = async function (element) {
            console.debug("Clicked on folder", element.target, element.target.attributes.key.value);
            await openRandom(element.target.attributes.key.value);
        }
    }
});

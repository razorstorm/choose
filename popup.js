// import Math
let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('chooseColor', function (data) {
    changeColor.style.backgroundColor = data.chooseColor;
    changeColor.setAttribute('value', data.chooseColor);
    // alert(data.chooseColor)
});

changeColor.onclick = function (element) {
    let color = element.target.value;
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     chrome.tabs.executeScript(
    //         tabs[0].id,
    //         { code: 'document.body.style.backgroundColor = "' + color + '";' });
    // });
    dumpBookmarks("Karen")
};

// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
    var bookmarkTreeNodes = chrome.bookmarks.getTree(
        function (bookmarkTreeNodes) {
            // console.log(bookmarkTreeNodes)
            // console.log('allnodes', bookmarkTreeNodes[0].children[0].children)
            const queriedChildren = grabFolderNodes(query, bookmarkTreeNodes[0].children[0].children)[0].children
            queriedChildren.forEach(child => console.log(child));

            const randomChild = queriedChildren[Math.floor(Math.random() * queriedChildren.length)];
            console.log('RANDOM WAS', randomChild.title);
            chrome.tabs.create({
                url: randomChild.url
            })

        });
}

function grabFolderNodes(query, bookmarkNodes) {
    return bookmarkNodes.filter(node => {
        // console.log('title', node.title, !query, String(node.title).toLowerCase().indexOf(query.toLowerCase()) !== -1)
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
function dumpNode(bookmarkNode, query) {
    // console.log("asdf", bookmarkNode.title)
    // console.log("asdf", bookmarkNode)
    if (bookmarkNode.title) {
        if (query && !bookmarkNode.children) {
            if (String(bookmarkNode.title).indexOf(query) == -1) {
                // console.log(bookmarkNode.title)
                return;
                // return $('<span></span>');
            } else {
                console.log('query', query, 'children', bookmarkNode.children, bookmarkNode.title)
            }
        }
        console.log(bookmarkNode.title)
        // var anchor = $('<a>');
        // anchor.attr('href', bookmarkNode.url);
        // anchor.text(bookmarkNode.title);
        // /*
        //  * When clicking on a bookmark in the extension, a new tab is fired with
        //  * the bookmark url.
        //  */
        // anchor.click(function () {
        //     chrome.tabs.create({ url: bookmarkNode.url });
        // });
        var span = $('<span>');
        // var options = bookmarkNode.children ?
        //     $('<span>[<a href="#" id="addlink">Add</a>]</span>') :
        //     $('<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
        //         'href="#">Delete</a>]</span>');
        // var edit = bookmarkNode.children ? $('<table><tr><td>Name</td><td>' +
        //     '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
        //     '</td></tr></table>') : $('<input>');
        // // Show add and edit links when hover over.
        // span.hover(function () {
        //     span.append(options);
        //     $('#deletelink').click(function () {
        //         $('#deletedialog').empty().dialog({
        //             autoOpen: false,
        //             title: 'Confirm Deletion',
        //             resizable: false,
        //             height: 140,
        //             modal: true,
        //             overlay: {
        //                 backgroundColor: '#000',
        //                 opacity: 0.5
        //             },
        //             buttons: {
        //                 'Yes, Delete It!': function () {
        //                     chrome.bookmarks.remove(String(bookmarkNode.id));
        //                     span.parent().remove();
        //                     $(this).dialog('destroy');
        //                 },
        //                 Cancel: function () {
        //                     $(this).dialog('destroy');
        //                 }
        //             }
        //         }).dialog('open');
        //     });
        //     $('#addlink').click(function () {
        //         $('#adddialog').empty().append(edit).dialog({
        //             autoOpen: false,
        //             closeOnEscape: true, title: 'Add New Bookmark', modal: true,
        //             buttons: {
        //                 'Add': function () {
        //                     chrome.bookmarks.create({
        //                         parentId: bookmarkNode.id,
        //                         title: $('#title').val(), url: $('#url').val()
        //                     });
        //                     $('#bookmarks').empty();
        //                     $(this).dialog('destroy');
        //                     window.dumpBookmarks();
        //                 },
        //                 'Cancel': function () {
        //                     $(this).dialog('destroy');
        //                 }
        //             }
        //         }).dialog('open');
        //     });
        //     $('#editlink').click(function () {
        //         edit.val(anchor.text());
        //         $('#editdialog').empty().append(edit).dialog({
        //             autoOpen: false,
        //             closeOnEscape: true, title: 'Edit Title', modal: true,
        //             show: 'slide', buttons: {
        //                 'Save': function () {
        //                     chrome.bookmarks.update(String(bookmarkNode.id), {
        //                         title: edit.val()
        //                     });
        //                     anchor.text(edit.val());
        //                     options.show();
        //                     $(this).dialog('destroy');
        //                 },
        //                 'Cancel': function () {
        //                     $(this).dialog('destroy');
        //                 }
        //             }
        //         }).dialog('open');
        //     });
        //     options.fadeIn();
        // },
        //     // unhover
        //     function () {
        //         options.remove();
        //     }).append(anchor);
    }
    var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
    if (bookmarkNode.children && bookmarkNode.children.length > 0) {
        li.append(dumpTreeNodes(bookmarkNode.children, query));
    }
    return li;
}
document.addEventListener('DOMContentLoaded', function () {
    // dumpBookmarks("Karen");
});
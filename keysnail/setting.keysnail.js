// site local key map
function fake(k, i) function(){key.feed(k,i)}; function pass(k,i) [k,fake(k,i)]; function ignore(k,i) [k,null];

plugins.options["site_local_keymap.local_keymap"] = {
    "^https?://mail.google.com/mail/": [
        pass(['g', 'i'], 3), pass(['g', 's'], 3), pass(['g', 't'], 3), pass(['g', 'd'], 3),
        pass(['g', 'a'], 3), pass(['g', 'c'], 3), pass(['g', 'k'], 3),
        // thread list
        pass(['*', 'a'], 3), pass(['*', 'n'], 3), pass(['*', 'r'], 3), pass(['*', 'u'], 3),
        pass(['*', 's'], 3), pass(['*', 't'], 3),
        // navigation
        ['u', null], ['k', null], ['j', null], ['o', null],
        ['p', null], ['n', null],
        // application
        ['c', null], ['q', null], ['?', null],
        // manipulation
        ['x', null], ['s', null], ['y', null], ['e', null],
        ['m', null], ['!', null], ['#', null], ['r', null],
        ['R', null], ['a', null], ['A', null], ['N', null],
        pass(['<tab>', 'RET'], 3), ['ESC', null],
        [']', null], ['[', null], ['z', null], ['.', null],
        ['I', null], ['U', null], ['C-s', null], ['T', null]
    ],
    "^https?://www.google.(co.jp|com)/reader/view/": [
        // jump
        pass(["g", "h"]), pass(["g", "a"]), pass(["g", "s"]), pass(["g", "S"]),
        pass(["g", "u"]), pass(["g", "t"]), pass(["g", "T"]), pass(["g", "d"]),
        pass(["g", "f"]), pass(["g", "F"]), pass(["g", "c"]), pass(["g", "C"]),
        pass(["g", "e"]), pass(["g", "p"]),
        // navigation
        ["i", null], ["j", null], ["k", null], ["n", null],
        ["p", null], ["N", null], ["P", null], ["X", null],
        ["o", null],
        // item
        ["s", null], ["L", null], ["t", null], ["S", null],
        ["D", null], ["v", null], ["o", null], ["c", null],
        ["C", null], ["m", null], ["T", null],
        // application
        ["r", null], ["u", null], ["1", null], ["2", null],
        ["/", null], ["=", null], ["-", null],
        // other
        [".", function() window.content.document.querySelector('#viewer-entries-container').scrollTop += 100],
        [">", function() window.content.document.querySelector('#viewer-entries-container').scrollTop -= 100],
        ["z", null],
    ],
    "^http://www.tumblr.com/dashboard": [
        ["t", function() {
            if (plugins.kungfloo) {
                plugins.ldrnail.pinnedLinksOrCurrentLink.forEach(function(link) {
                    plugins.kungfloo.reblog(link, true, false, ["ReBlog - Tumblr link"]);
                });
                plugins.ldrnail.clearPin();
            }
        }],
        ["c", function() {
            let url = plugins.ldrnail.currentLink.href;
            let postId = parseInt(url.match(/^http:\/\/[^\/]+\/post\/(\d+)/)[1]) + 1;
            content.location.href = 'http://www.tumblr.com/dashboard/1/' + postId;
        }],
    ],
    "^http://www.slideshare.net/": [
        ["j", function() ext.exec("slideshare-next")],
        ["k", function() ext.exec("slideshare-previous")],
        ["F", function() ext.exec("slideshare-toggle-fullscreen")],
    ],
};

/*
// preferldrize
plugins.options["prefer_ldrize.keymap"] = {
    "j" : null, "k" : null, "p" : null, "v" : null, "o" : null,
    "i" : function() {
        let titles = '';
        plugins.ldrc.getPinnedItemsOrCurrentItem(true).forEach(function(item){
            RIL.saveLink(item[0].href, item[1], RIL.xul('clickToSaveTags').value);
            titles += ' ' + item[1] + "\n";
        });
        if (titles.length > 0)
        display.prettyPrint('Add RIL \n' + titles, { timeout: 1000 });
    },
    //"l" : function() ext.exec("ldrc-pin-list"),
    "l" : function() {
        let infos = plugins.ldrc.LDRize.siteinfo_available;
        let collection = infos.map(function(s) s.name);
        prompt.selector({
            message    : "select site info :",
            collection : collection,
            initialIndex : infos.indexOf(plugins.ldrc.LDRize.getSiteinfo()),
            callback   : function (i) { if (i >= 0) plugins.ldrc.LDRize.setSiteinfoByName(collection[i]); }
        });
    },
};
*/

plugins.options["ldrnail.keybind"] = {
    "j" : 'next', "k" : 'prev', "p" : 'pin', "v" : 'view', "o" : 'open', 'l': 'list',
    'C-s': 'siteinfo',
    "B": function() {
        let link = plugins.ldrnail.currentLink;
        if (link)
            plugins.kungfloo.reblog(link, true, true);
    },
    "i" : function() {
        let titles = [];
        plugins.ldrnail.pinnedItemsOrCurrentItem.forEach(function(item){
            let url = plugins.ldrnail.getItemLink(item).href;
            let title = plugins.ldrnail.getItemView(item) || url;
            if (url) {
                RIL.saveLink(url, title, RIL.xul('clickToSaveTags').value);
                titles.push(title);
            }
        });
        plugins.ldrnail.clearPin();
        if (titles.length > 0)
            display.prettyPrint('Add RIL \n' + titles.join('\n'), { timeout: 1000 });
    },
};
plugins.options["ldrnail.pre_open_filter"] = function(aURL)
    (!/^https?:\/\/docs\.google\.com/.test(aURL) && /^[^?#]+\.pdf[$#?]/i.test(aURL)) ?
        'https://docs.google.com/viewer?url='+encodeURIComponent(aURL)+'&embedded=true&chrome=true' : aURL;

// tanything
plugins.options["tanything_opt.keymap"] = util.extendDefaultKeymap({
    "o" : "localOpen",
    "d" : "localClose",
    "p" : "localLeftclose",
    "n" : "localRightclose",
    "q" : "localAllclose",
    "D" : "localDomainclose",
    "Y" : "localClipUT",
    "y" : "localClipU",
    "e" : "localMovetoend",
    "p" : "localTogglePin",
    "b" : "localAddBokmark",
    "u" : "localUnloadTab",
});

// Yet Another Twitter Client Keysnail
plugins.options["twitter_client.prefer_screen_name"] = true;
plugins.options["twitter_client.update_interval"] = 180000;
plugins.options["twitter_client.keymap"] = util.extendDefaultKeymap({
    "t"     : "tweet",
    "r"     : "reply",
    "R"     : "official-retweet",
    "d"     : "send-direct-message",
    "D"     : "delete-tweet",
    "f"     : "add-to-favorite",
    "F"     : "show-user-favorites",
    "v"     : "display-entire-message",
    "V"     : "view-in-twitter",
    "c"     : "copy-tweet",
    "*"     : "show-target-status",
    "@"     : "show-mentions",
    "/"     : "search-word",
    "o"     : "open-url",
    "+"     : "show-conversations",
    "h"     : "refresh-or-back-to-timeline",
    "s"     : "switch-to"
});
plugins.options["twitter_client.filters"] = [
    function(s)
        !(s.user.screen_name=="10th543" && s.retweeted_status),
];

// bmany
plugins.options["bmany.default_open_type"] = "tab";
plugins.options["bmany.keymap"] = {
    "C-e" : "edit-bookmark"
};

// hatebnail
plugins.options['hatebnail.show_bookmark_key'] = 'h';

// kungfloo
plugins.options['kungfloo.keymap'] = util.extendDefaultKeymap({
    "R" : "reblog",
    "r" : "reblog-with-dialog"
});

// refcontrol
plugins.options['refcontrol.sites'] = {
    'blogs.yahoo.co.jp'   : '',
    'fc2.com'             : '',
    'image.itmedia.co.jp' : '@FORGE',
    'img.itmedia.co.jp'   : '@FORGE',
    'plusd.itmedia.co.jp' : '',
    'www.amazon.co.jp'    : '',
    'images-amazon.com'   : '',
    'www.tumblr.com'      : '',
    'ameba.jp'            : '',
    'nagamochi.info'      : '',
};

// Login manager
plugins.options['login_manager.auto_login'] = [
    'google', 'hatena'
];

// heaven's door for .NET
plugins.options["heaven.dotnet.references"] = [{
    name  : "dotnet",
    param : { rootDocUrl : "http://msdn.microsoft.com/en-us/library/gg145045.aspx" }
}];

// gmail checker
plugins.options['gmail_checker.interval'] = 180;

// gesture
plugins.options["ProgrammableGesture.actions"]=function(p){with(p){try{return{
    Up:chain('upper-directory',{
      Down:chain('reload-the-page',{
        Up:chain('reload-the-page-ignore-cache'),
      }),
    }),
    Down:chain('open-the-new-tab',{
      Right:chain('close-tab-window',{
        Down:chain({
          Right:chain('close-all-tabs-on-right'),
          Left:chain('close-all-tabs-on-left'),
        }),
      }),
      Left:chain('ril-append-and-close'),
    }),
    Left:chain('back',{ }),
    Right:chain('forward',{
      Left:chain('undo-closed-tab'),
      Down:chain({
        Right:chain(action("ソースを表示",function() openUILinkIn('view-source:' + content.location.href, 'tab'))),
      }),
    }),
    WheelUp:soon('select-previous-tab'),
    WheelDown:soon('select-next-tab'),
  };
}catch(e){util.fbug(e)}}}

// HoK
plugins.options['hok.actions'] = [
    ['m', 
     M({ja:'右クリックメニューを開く',en:'Open context menu'}),
     function (e) plugins.hok.openContextMenu(e),
     ],
    ['S',
     'Hatena Star',
     function(e) plugins.hok.followLink(e, 4),
     false, true, 'img.hatena-star-add-button'],
    [':',
     'Google image search',
     function(e) {
         if (e.src) {
             let url = 'http://www.google.com/searchbyimage?image_url=' + encodeURIComponent(e.src);
             openUILinkIn(url, 'tab');
         }
     },
     false, false, 'img'],
    ['F',
     'Flash',
     function(e) e.focus(),
     false, false, 'embed, div[bgactive*="chrome://flashblock/content/"]'],
];

// history
plugins.options['history.max-results'] = 10000;

// Expander
plugins.options['dabbrev.next_key'] = 'C-n';
plugins.options['dabbrev.prev_key'] = 'C-p';

// 次へ、前へ
plugins.options["follow-link.nextrel"] = 'a[rel="next"]';
plugins.options["follow-link.prevrel"] = 'a[rel="prev"]';
plugins.options["follow-link.targets"] = 'a[href], input:not([type="hidden"]), button';
plugins.options["follow-link.nextpattern"] = "^次へ|進む|^次.*|続|→|\\bnext|>>|≫|\\bnewer";
plugins.options["follow-link.prevpattern"] = "\\bback|戻る|^前.*|^<前|←|\\bprev|<<|≪|\\bolder";


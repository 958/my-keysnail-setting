// site local key map
function fake(k, i) function(){key.feed(k,i)}; function pass(k,i) [k,fake(k,i)]; function ignore(k,i) [k,null];
function follow(elem) !elem || plugins.hok.followLink(elem, plugins.hok.CURRENT_TAB);
function followId(id) function(){follow(content.document.getElementById(id))};
function followSelector(selector) function(){follow(content.document.querySelector(selector))};

plugins.options["site_local_keymap.local_keymap"] = {
    "^https?://mail.google.com/mail/": [
        pass(['g', 'i']), pass(['g', 's']), pass(['g', 't']), pass(['g', 'd']),
        pass(['g', 'a']), pass(['g', 'c']), pass(['g', 'k']), pass(['g', 'l']),
        // thread list
        pass(['*', 'a']), pass(['*', 'n']), pass(['*', 'r']), pass(['*', 'u']),
        pass(['*', 's']), pass(['*', 't']),
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
        ["j", null], ["k", null], ["n", null],
        ["j", null], ["k", null], ["n", null],
        ["p", null], ["N", null], ["P", null], ["X", null],
        ["o", function() {
            try {
                var doc = content.document;
                var cur = doc.querySelector('#current-entry');
                var link = cur.querySelector('.entry-title-link');
                openUILinkIn(link.href, 'tabshifted', false, null, 
                        Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService).
                            newURI(content.location.href, null, null));
            } catch(e) { }
        }],
        // item
        ["s", null], ["L", null], ["t", null], ["S", null],
        ["D", null], ["v", null], ["c", null],
        ["C", null], ["m", null], ["T", null],
        // application
        ["r", null], ["u", null], ["1", null], ["2", null],
        ["/", null], ["=", null], ["-", null],
        // other
        [".", function() content.document.querySelector('#viewer-entries-container').scrollTop += 100],
        [">", function() content.document.querySelector('#viewer-entries-container').scrollTop -= 100],
        ["z", null],
        ["i", function() {
            try {
                var doc = content.document;
                var cur = doc.querySelector('#current-entry');
                var link = cur.querySelector('.entry-title-link');
                RIL.saveLink(link.href, link.textContent, '');
                display.echoStatusBar('Add RIL :' + link.textContent);
            } catch(e) { }
        }],
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
    "^https?://www.slideshare.net/": [
        ["j", function() ext.exec("slideshare-next")],
        ["k", function() ext.exec("slideshare-previous")],
        ["F", function() ext.exec("slideshare-toggle-fullscreen")],
    ],
    "^https?://speakerdeck.com/": [
        ['j', function () ext.exec("speakerdeck-next")],
        ['k', function () ext.exec("speakerdeck-previous")],
        ['F', function () ext.exec("speakerdeck-toggle-fullscreen")], 
    ],
    "^https?://docs.google.com/viewer": [
        ['J', followId('nextToolbarButton')], ['K', followId('prevToolbarButton')],
        [['g', 'g'], fake('<home>')], ['G', fake('<end>')],
        ['/', followId('searchBox')], ["n", followId('nextSearchToolbarButton')], ["N", followId('prevSearchToolbarButton')],
    ],
    "^http://ssr.minidns.net/": [
        ["j", null], ["k", null], ["p", null], ["t", null], ["z", null],
    ],
    "https?://www.evernote.com/": [
        ['j', function() {
            content.document.getElementById('EN_IframePanel_1').contentWindow.focus();
            key.generateKey(content.document.getElementById('EN_IframePanel_1').contentWindow, KeyEvent.DOM_VK_DOWN, true);
        }],
        ['k', function() {
            content.document.getElementById('EN_IframePanel_1').contentWindow.focus();
            key.generateKey(content.document.getElementById('EN_IframePanel_1').contentWindow, KeyEvent.DOM_VK_UP, true);
        }],
        ['/', function() follow(content.document.querySelector('#gwt-debug-searchBox'))],
        ['n', function() follow(content.document.querySelector('.selectedNoteSnippet').nextSibling)],
        ['p', function() follow(content.document.querySelector('.selectedNoteSnippet').previousSibling)],
        [['g','a'], function() follow(content.document.querySelector('.notebook:first-of-type>div:first-of-type'))],
        [['g','n'], function() {
            var note = content.document.querySelector('.selectedNotebook>div:first-of-type');
            var notes = Array.slice(content.document.querySelectorAll('.notebook>div:first-of-type'));
            follow(notes[notes.indexOf(note) + 1] || notes[0]);
        }],
        [['g','p'], function() {
            var note = content.document.querySelector('.selectedNotebook>div:first-of-type');
            var notes = Array.slice(content.document.querySelectorAll('.notebook>div:first-of-type'));
            follow(notes[notes.indexOf(note) - 1] || notes[notes.length - 1]);
        }],
    ],
};

// ldrnail
plugins.options["ldrnail.keybind"] = {
    "j" : 'next', "k" : 'prev', "p" : 'pin', "v" : 'view', "o" : 'open', 'l': 'list',
    'C-s': 'siteinfo',
    "t": function() {
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
            display.echoStatusBar('Add RIL :' + titles.join(', '));
    },
};
plugins.options["ldrnail.pre_open_filter"] = function(url) {
    const extRe = new RegExp('^[^\\?#]+\\.(' +
        ['doc','docx','xls','xlsx','ppt','pptx','pdf'].join('|') +
        ')($|[#?])', 'i');
    return (!/^https?:\/\/docs\.google\.com/.test(url) && extRe.test(url)) ?
        'http://docs.google.com/viewer?url='+encodeURIComponent(url)+'&chrome=true' :
        url;
}
plugins.options["ldrnail.css_highlight_current_before"] = '';
plugins.options["ldrnail.css_highlight_current"] = 
    'outline: 2px solid #871F5F !important;' +
    'outline-offset: 1px !important;' +
    '-moz-outline-radius: 3px !important;';
plugins.options["ldrnail.use_intelligence_scroll"] = true;
plugins.options["ldrnail.default_height"] = 50;
plugins.options["ldrnail.siteinfo"] = [
    {
        name: 'Yahoo blog search',
        domain: '^http://blog\\.search\\.yahoo\\.co\\.jp/search\\?.+',
        paragraph: '//div[contains(concat(" ",normalize-space(@class)," ")," cl ")]',
        link: './/h2/a',
        view: './/h2',
        focus: '//input[@id="yschsp"]',
    },
    {
        name: 'Google web history',
        domain: '^https://www\\.google\\.com/history/',
        paragraph: '//table[contains(concat(" ",normalize-space(@class)," ")," result ")]',
        link: './/a',
        focus: '//input[@id="kd-searchfield"]',
    },
    {
        name: 'New Hatena bookmark',
        domain: '^http://b\\.hatena\\.ne\\.jp/',
        paragraph: '//*[contains(concat(" ",normalize-space(@class)," ")," entry-block ") or contains(concat(" ",normalize-space(@class)," ")," entry-body ") or @id="page-loading-message"]',
        link: './/h3/a',
        view: './/h3',
    },
];

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
    "s"     : "switch-to",
});

// bmany
plugins.options["bmany.default_open_type"] = "tab";
plugins.options["bmany.keymap"] = {
    "E" : "edit-bookmark",
    "D" : "remove-bookmark",
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
        Right:chain(action(L("ソースを表示"),function() openUILinkIn('view-source:' + content.location.href, 'tab'))),
      }),
    }),
    WheelUp:soon('select-previous-tab'),
    WheelDown:soon('select-next-tab'),
  };
}catch(e){util.fbug(e)}}}

// HoK
plugins.options['hok.hint_base_style'] = {
    'position'      : 'fixed',
    'top'           : '0',
    'left'          : '0',
    'z-index'       : '2147483647',
    'color'         : '#222',
    'font-family'   : 'MeiryoKe_Gothic',
    'font-size'     : '9pt',
    'font-weight'   : 'bold',
    'line-height'   : '8pt',
    'padding'       : '2px 4px',
    'margin'        : '0px',
    'border'        : 'none',
    'border-radius' : '4px',
    'text-transform': 'uppercase',
    'opacity'       : '0.9',
    'box-shadow'    : '2px 2px rgba(0,0,0,0.4)',
};
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
     'Facebook like',
     function(e) plugins.hok.followLink(e, 4),
     false, false, 'a.connect_widget_like_button.like_button_no_like, a.connect_widget_like_button.like_button_like>div.tombstone_cross'],
    [ 'O',
      M({ja: 'リンクを Google Chrome で開く', en: 'Open with Google Chrome'}),
      function(e) plugins.launcher.launch('google-chrome', e.href),
      false, false, "a[href]"],
];
plugins.options["hok.local_queries"] = [
    ['^https?://www\\.google\\.(co\\.jp|com)/reader/view/', '*.unselectable, *.link'],
];

// history
plugins.options['history.max-results'] = 10000;

// Expander
plugins.options['dabbrev.next_key'] = 'C-n';
plugins.options['dabbrev.prev_key'] = 'C-p';
plugins.options["dabbrev.candidates"] = [
    "KeySnail",
    "Plugin",
];
// 次へ、前へ
plugins.options["follow-link.nextrel"] = 'a[rel="next"]';
plugins.options["follow-link.prevrel"] = 'a[rel="prev"]';
plugins.options["follow-link.targets"] = 'a[href], input:not([type="hidden"]), button';
plugins.options["follow-link.nextpattern"] = L("^次へ|進む|^次.*|続|→|\\bnext|>>|≫|\\bnewer");
plugins.options["follow-link.prevpattern"] = L("\\bback|戻る|^前.*|^<前|←|\\bprev|<<|≪|\\bolder");

// launcher
plugins.options['launcher.apps'] = {
    'wwwc-check-update': {
        description: 'WWWC check update',
        path: 'c:\\tools\\wwwc.lnk',
        defaultArgs: ["/c", "/e", "/a"],
    },
    'google-chrome': {
        description: 'Open with Google Chrome',
        path: 'c:\\tools\\Google Chrome.lnk',
        defaultArgs: ['%URL'],
    },
};

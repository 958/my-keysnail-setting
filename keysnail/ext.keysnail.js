//最近閉じたタブ
// http://d.hatena.ne.jp/mooz/20091123/p1
ext.add("list-closed-tabs", function () {
    const fav = "chrome://mozapps/skin/places/defaultFavicon.png";
    var ss   = Cc["@mozilla.org/browser/sessionstore;1"].getService(Ci.nsISessionStore);
    var json = Cc["@mozilla.org/dom/json;1"].createInstance(Ci.nsIJSON);
    var closedTabs = [[tab.image || fav, tab.title] for each (tab in json.decode(ss.getClosedTabData(window)))];
    if (!closedTabs.length)
        return void display.echoStatusBar("最近閉じたタブが見つかりませんでした", 2000);
    prompt.selector({
        message    : "select tab to undo:",
        collection : closedTabs,
        keymap     : util.extendDefaultKeymap(),
        flags      : [ICON | IGNORE, 0],
        callback   : function (i) { if (i >= 0) window.undoCloseTab(i); }
    });
}, "List closed tabs");

//ブラウザの戻る履歴
// http://malblue.tumblr.com/post/349001250/tips-japanese-keysnail-github
ext.add("list-tab-history", function () {
    var tabHistory = [];
    var sessionHistory = gBrowser.webNavigation.sessionHistory;
    if (sessionHistory.count < 1)
        return void display.echoStatusBar("Tab history not exist", 2000);
    var curIdx = sessionHistory.index;
    for (var i = 0; i < sessionHistory.count; i++) {
        var entry = sessionHistory.getEntryAtIndex(i, false);
        if (!entry)
            continue;
        tabHistory.push([util.getFaviconPath(entry.URI.spec), entry.title, entry.URI.spec, i]);
    }
    for (var thIdx = 0; thIdx < tabHistory.length; thIdx++) {
        if (tabHistory[thIdx][3] == curIdx) break;
    }
    prompt.selector({
        message     : "select history in tab",
        collection  : tabHistory,
        flags       : [ICON | IGNORE, 0, 0, IGNORE | HIDDEN],
        header      : ["Title", "URL"],
        initialIndex: thIdx,
        callback    : function(i) { if (i >= 0) gBrowser.webNavigation.gotoIndex(tabHistory[i][3]); },
        keymap      : util.extendDefaultKeymap(),
        stylist     : function (args, n, current) {
            let style = '';
            if (args[3]== thIdx) style += 'font-weight:bold;';
            return style;
        }
    });
},  'List tab history');

// 次へ、前へ
//https://gist.github.com/310776#file_follow_rel_keysnail.js
function followRel(doc, rel, pattern) {
    let target = doc.querySelector(rel);
    if (target)
        return plugins.hok.followLink(target, plugins.hok.CURRENT_TAB);
    // otherwise
    let regex = new RegExp(pattern, "i");
    let targets = doc.querySelectorAll(plugins.options["follow-link.targets"]);
    for (let [, elem] in Iterator(targets))
        if (regex.test(elem.textContent.trim()) /*|| regex.test(elem.value) */)
            return plugins.hok.followLink(elem, plugins.hok.CURRENT_TAB);
}
ext.add("follow-next-link", function ()
    followRel(content.document, plugins.options["follow-link.nextrel"], plugins.options["follow-link.nextpattern"])
, "follow next link");
ext.add("follow-prev-link", function ()
    followRel(content.document, plugins.options["follow-link.prevrel"], plugins.options["follow-link.prevpattern"])
, "follow previous link");

// C-^
if (typeof gBrowser !== 'undefined' && gBrowser.tabContainer) {
    let prev = gBrowser.tabContainer.selectedIndex;
    let cur = prev;
    gBrowser.tabContainer.addEventListener("TabSelect", function(){
        prev = cur;
        cur = gBrowser.tabContainer.selectedIndex;
    }, false);
    ext.add("toggle-selected-tab", function() gBrowser.tabContainer.selectedIndex = prev, L('選択タブをトグルする'));
}

// Plugin reload
// http://keysnail.g.hatena.ne.jp/mooz/20100523/1274619516
ext.add("reload-plugin", function () {
    let plugins = util.readDirectory(userscript.pluginDir, true)
        .filter(function (file) !(file.leafName.match("^_.+\\.ks\\.js$") ||
                                  !file.leafName.match("\\.ks\\.js$") ||
                                  file.isDirectory()));
    prompt.selector({
        message     : "reload plugin:",
        collection  : plugins.map(function (f) f.leafName),
        callback    : function (i) { if (i >= 0) userscript.loadPlugin(plugins[i], true); }
    });
}, "Load specified plugin");

// https://gist.github.com/225955
ext.add("edit-userchrome-css", function(){
    let file = util.getSpecialDir("UChrm");
    file.append("userChrome.css");
    userscript.editFile(file.path);
}, M({ja: "userChrome.css を編集", en: "Edit userChrome.css"}));

ext.add("google-search", function(ev, arg) {
    let engines = util.suggest.getEngines();
    let suggestEngines = [util.suggest.ss.getEngineByName("Google")];
    util.suggest.searchWithSuggest(suggestEngines[0], suggestEngines, "tab");
}, "Google search");

ext.add("google-search-in-site", function(ev, arg) {
    let host = content.location.hostname;
    let engines = util.suggest.getEngines();
    let suggestEngines = [util.suggest.ss.getEngineByName("Google")];
    prompt.reader({
        message    : util.format("Search [%s]:", suggestEngines[0].name + ' (' + host + ')'),
        group      : "web-search",
        flags      : [0, 0],
        style      : ["", style.prompt.url],
        completer  : completer.fetch.suggest(suggestEngines, true),
        callback   : function (query) {
            if (query) {
                let uri = suggestEngines[0].getSubmission(query + ' site:' + host, null).uri.spec;
                openUILinkIn(uri, "tab");
            }
        }
    });
}, "Google search");

// https://gist.github.com/285701
ext.add("search-with-suggest", function(ev, arg) {
    let engines = util.suggest.getEngines();
    let suggestEngines = [util.suggest.ss.getEngineByName("Google")];
    let collection = engines.map(function (engine) [(engine.iconURI || {spec: ""}).spec, engine.name, engine.description]);
    prompt.selector({
        message: "engine:",
        collection: collection,
        flags: [ICON | IGNORE, 0, 0],
        header: ["Name", "Description"],
        callback: function (i) {
            if (i >= 0) {
                let text = (document.commandDispatcher.focusedWindow || gBrowser.contentWindow).getSelection().toString();
                if (text.length > 0)
                    openUILinkIn(engines[i].getSubmission(text, null).uri.spec, "tab");
                else
                    util.suggest.searchWithSuggest(engines[i], suggestEngines, "tab");
            }
        }
    });
}, "Search with Suggest");
/*
// https://gist.github.com/754709
ext.add("option-migrator", function () {
    function getOpt(info) {
        let _prefix = null;

        function quote(str) '"' + str.replace(/"/g, '\\"') + '"';

        function descToM(descriptions)
            "M({\n" + [desc for each (desc in descriptions)].map(function (desc)
                " " + (desc.@lang.toString() || "en") + ": " + quote(L(desc.text()))
            ).join(",\n") + "})";

        let bodyText = [option for each (option in info.options.option)].map(function (option) {
            let fullName = option.name.text();
            let [prefix, optionName] = fullName.split(".");

            if (!_prefix) _prefix = prefix;

            return util.format('\
    %s : {\
        preset: "",\
        description: %s,\
        type: %s\
    ',
                optionName.quote(),
                descToM(option.description),
                option.type.quote());
        }).join(",\n");

        return 'const pOptions = plugins.setupOptions("' + _prefix + '", {' +
            bodyText +
            "}, PLUGIN_INFO);";
    }

    prompt.selector({
        message     : "select plugin: ",
        flags       : [IGNORE | HIDDEN, 0],
        collection  : [[path, util.getLeafNameFromURL(util.pathToURL(path))]
                      for ([path] in Iterator(plugins.context))],
        callback    : function (i, collections) {
            if (i < 0) return;
            let path = collections[i][0];
            let info = plugins.context[path].PLUGIN_INFO;
            let optText = getOpt(info);
            util.message(optText);
            command.setClipboardText(optText);
            //alert(optText);
        }
    });
}, "Option migrator");
*/
//https://gist.github.com/342285
ext.add('input-html-tag', function inputTag(ev, arg) {
    const tags = ["a","address","applet","area","b","base","basefont","blockquote",
                "body","br","caption","center","cite","code","dd","div","dl","dt",
                "em","font","form","frame","frameset","head","hn","hr","html","i",
                "img","input","isindex","kbd","li","link","map","meta","noframes",
                "noscript","ol","option","p","param","pre","samp","script","select",
                "small","strikebig","strong","sub","sup","td","textarea","th","title",
                "tr","tt","u","ul","var"];

    let input = ev.originalTarget;
    prompt.reader( {
        message : "Input tag:",
        completer : completer.matcher.header(tags),
        callback : function (tag) {
            let {scrollLeft, scrollTop} = input;
            let cursorPos = input.selectionStart;

            let selection = input.value.slice(input.selectionStart, input.selectionEnd);
            command.insertText("<" + tag + ">" + selection + "</" + tag + ">");

            input.selectionStart = input.selectionEnd = cursorPos + tag.length + selection.length + 2;

            input.scrollLeft = scrollLeft;
            input.scrollTop = scrollTop;
        }
    });
}, L("HTML のタグを挿入"));

ext.add('show-memory-report', function(ev, arg) {
    function addFigure(str) {
        var num = new String(str).replace(/,/g, "");
        while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
        return num;
    }

    function getMemoryReports() {
        let mrm = Cc["@mozilla.org/memory-reporter-manager;1"].getService(Ci.nsIMemoryReporterManager);
        let e = mrm.enumerateReporters();
        while (e.hasMoreElements()) {
            let {path, description, amount} = e.getNext().QueryInterface(Ci.nsIMemoryReporter);
            yield [path, description, addFigure(amount)];
        }
    }

    prompt.selector({
        message     : 'pattern:',
        initialInput: arg,
        collection  : [i for (i in getMemoryReports())],
        header      : ['path', 'description', 'size'],
        width       : [30, 60, 10],
        flags       : [0, 0,  IGNORE],
        stylist     : function (args, n, current) {
            let style = '';
            if (n == 2) style += 'padding-right: 0.5em; text-align: right;';
            return style;
        },
        actions     : [function(){}],
    });
}, 'about:memory');

ext.add('go-to-keyword', function(ev, arg) {
     function getFavicon(aURL)
         (!aURL) ? "chrome://mozapps/skin/places/defaultFavicon.png" : aURL;

    //Opera の Go to nickname をパクル - Griever
    //http://d.hatena.ne.jp/Griever/20090625/1245933515
    //を KeySnail + bmany plugin で
    const openMode = "tab";
    var bmsvc = Cc['@mozilla.org/browser/nav-bookmarks-service;1'].getService(Ci.nsINavBookmarksService);
    var keywords = function () {
        var ios = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);
        return function (aItemId) {
            var ret = [];
            var parentNode = PlacesUtils.getFolderContents(aItemId).root;
            for (let i = 0; i < parentNode.childCount; i++) {
                let childNode = parentNode.getChild(i);
                if (PlacesUtils.nodeIsBookmark(childNode)) {
                    let keyword = bmsvc.getKeywordForBookmark(childNode.itemId);
                    if (keyword) ret.push({ keyword: keyword, bookmark: childNode });
                } else if (PlacesUtils.nodeIsFolder(childNode))
                    ret = ret.concat(arguments.callee(childNode.itemId));
            }
            return ret;
        }(1);
    }();
    prompt.reader({
        message: "Go to keyword:",
        completer: function (str) {
            var completionList = keywords.filter(function(k) k.keyword.indexOf(str) === 0).map(function(k) {
                return [k.keyword, getFavicon(k.bookmark.icon), k.bookmark.title, k.bookmark.uri];
            });
            return {
                collection: completionList,
                flags: [0, ICON|IGNORE, 0, 0],
                origin: 0,
                query: str
            };
        },
        onChange: function (arg) {
            if (arg.event.keyCode === KeyEvent.DOM_VK_SHIFT ||
                arg.event.keyCode === KeyEvent.DOM_VK_TAB)
                return;

            var value = arg.textbox.value;
            var matchKeywords = keywords.filter(function (k) k.keyword.indexOf(value) === 0);
            if (matchKeywords.length === 1) {
                plugins.bmany.go(matchKeywords[0].bookmark.uri, openMode);
                prompt.finish(true);
            }
        },
        callback: function (value) plugins.bmany.go(matchKeywords[0].bookmark.uri, openMode)
    });
}, M({ja:'ブックマークのキーワードから即座に開く', en:'Open keyword bookmark'}));

ext.add('copy-gist-plugin-info', function(ev, arg) {
    const text = content.document.querySelectorAll('pre')[1].textContent;
    const keys = ['name', 'description lang="ja"', 'updateURL', 'iconURL'];
    const template = ('\
<tr>\
<td><img src="%iconURL%"></td>\
<td style="vertical-align:middle"><a href="%URL%">%name%</a></td>\
<td style="vertical-align:middle">%description lang="ja"%</td>\
<td style="vertical-align:middle"><a href="%updateURL%">Install</a></td>\
</tr>\
').toString();
    let src = template;
    src = src.replace('%URL%', content.location.href);
    keys.forEach(function (key) {
        let replaceText = '';
        if (text.match(new RegExp('<' + key + '>([^<]+)</')))
            replaceText = RegExp.$1;
        src = src.replace('%' + key + '%', replaceText);
    });
    command.setClipboardText(src);
}, 'Copy gist plugin info');

ext.add('xulmigemo-find-init', function(ev, arg) {
    window.XMigemoFind.target = document.getElementById('content');
    window.XMigemoFind.clear(false);
    window.XMigemoFind.isLinksOnly = false;
    window.XMigemoFind.isQuickFind = false;
    window.XMigemoFind.findMode = window.XMigemoFind.FIND_MODE_MIGEMO;
    window.XMigemoFind.caseSensitive = false;
    prompt.reader({
        message : 'Find:',
        onChange: function (arg) window.XMigemoFind.find(false, arg.textbox.value, false),
        callback: function (text) { }
    });
}, 'XULMigemo find');

ext.add('xulmigemo-find-next', function(ev, arg) {
    window.XMigemoFind.target = document.getElementById('content');
    window.XMigemoFind.findNext(false);
}, 'XULMigemo find next');

ext.add('xulmigemo-find-prev', function(ev, arg) {
    window.XMigemoFind.target = document.getElementById('content');
    window.XMigemoFind.findPrevious(false);
}, 'XULMigemo find previous');

ext.add('optimize-sqlite', function(ev, arg) {
    let thread = Cc["@mozilla.org/thread-manager;1"].getService().mainThread;
    util.readDirectory(util.getSpecialDir('ProfD'), true)
        .filter(function (file) (!file.leafName.match("^places\\.sqlite$") &&
                                  file.leafName.match("\\.sqlite$") &&
                                 !file.isDirectory()))
        .forEach(function(file) {
            util.message(file.leafName);
            display.echoStatusBar(file.leafName);
            thread.processNextEvent(true);

            try {
                let dbc = storageService.openDatabase(file);
                dbc.executeSimpleSQL("REINDEX");
                dbc.executeSimpleSQL("VACUUM");
            } catch(e) {
                util.message(e.description)
            }
        });

    util.message('places.sqlite');
    display.echoStatusBar('places.sqlite');
    thread.processNextEvent(true);

    let dbc = Cc["@mozilla.org/browser/nav-history-service;1"]
       .getService(Ci.nsPIPlacesDatabase).DBConnection;
    dbc.executeSimpleSQL("REINDEX");
    dbc.executeSimpleSQL("VACUUM");

    display.echoStatusBar('');
}, 'Optimize SQLite Database');

// http://www.pshared.net/diary/20111029.html
ext.add('clear-cache', function(ev, arg) {
  let cacheService = Cc["@mozilla.org/network/cache-service;1"].getService(Ci.nsICacheService);
  cacheService.evictEntries(Ci.nsICache.STORE_IN_MEMORY);
  cacheService.evictEntries(Ci.nsICache.STORE_ON_DISK);
  cacheService.evictEntries(Ci.nsICache.STORE_ON_DISK_AS_FILE);
  cacheService.evictEntries(Ci.nsICache.STORE_OFFLINE);
  cacheService.evictEntries(Ci.nsICache.STREAM_BASED);
}, 'Clear cache');

//http://keysnail.g.hatena.ne.jp/mooz/20100305/1267756292
function transposeSubString(input, beg, end, to) {
    let txt = input.value;

    let head = txt.slice(0, beg);
    let left = txt.slice(beg, end);
    let right = txt.slice(end, to);
    let tail = txt.slice(to);

    let {scrollTop, scrollLeft} = input;

    input.value = head + right + left + tail;
    input.selectionStart = input.selectionEnd = txt.length - tail.length;

    if (scrollTop === scrollLeft === 0)
        command.inputScrollSelectionIntoView(input);
    else
        input.scrollTop = scrollTop, input.scrollLeft = scrollLeft;
}

function transposeChars(ev, arg) {
    let input = ev.originalTarget;
    let begin = input.selectionEnd - (
            (input.selectionEnd == input.value.length) ? 2 :
                ((input.selectionEnd == 0) ? 0 : 1));
    let end = begin + 1;
    let to = end + (typeof arg === 'number' ? Math.max(arg, 1) : 1);
    transposeSubString(input, begin, end, to);
}

ext.add("transpose-chars", transposeChars, "Interchange characters around point");

ext.add('select-user-agent', function(ev, arg) {
    var selectedItem = null;
    var collection = Array.map(
        document.getElementById('useragentswitcher-menu').getElementsByAttribute('type', 'radio'),
        function (ua) {
            var ret = [ua.label, ua];
            if (ua.getAttribute('checked'))
                selectedItem = ret;
            return ret;
        }
    );
    prompt.selector({
        message     : "select user agent:",
        initialIndex: collection.indexOf(selectedItem),
        collection  : collection,
        flags       : [0, HIDDEN | IGNORE],
        callback    : function (i) {
            if (i > 0)
                UserAgentSwitcher.switchUserAgent(collection[i][1]);
            else if (i == 0)
                UserAgentSwitcher.reset();
        }
    });
}, 'Select User Agent');

ext.add('show-links', function(ev, arg) {
    var selector = {
        _lastSelection: null,
        // via XULMigemo
        _getSelectionController: function(aTarget)
            aTarget
                .QueryInterface(Ci.nsIInterfaceRequestor)
                .getInterface(Ci.nsIWebNavigation)
                .QueryInterface(Ci.nsIDocShell)
                .QueryInterface(Ci.nsIInterfaceRequestor)
                .getInterface(Ci.nsISelectionDisplay)
                .QueryInterface(Ci.nsISelectionController),
        selectAndScroll: function(elem) {
            if (selector._lastSelection) selector._lastSelection.removeAllRanges();
            var range = elem.ownerDocument.createRange();
            range.selectNode(elem);
            var sc = selector._getSelectionController(elem.ownerDocument.defaultView);
            try{
                sc.setDisplaySelection(sc.SELECTION_ATTENTION);
                sc.repaintSelection(sc.SELECTION_NORMAL);
            }catch(e){ }
            var selection = sc.getSelection(sc.SELECTION_NORMAL);
            selector._lastSelection = selection;
            selection.addRange(range);
            try {
                selection.QueryInterface(Ci.nsISelectionPrivate).scrollIntoView(
                    Ci.nsISelectionController.SELECTION_ANCHOR_REGION, true, 50, 50);
            }catch(e){ }
        },
        destroy: function() {
            if (selector._lastSelection) selector._lastSelection.removeAllRanges();
            selector._lastSelection = null;
        }
    };

    var links = (function getLinks(win)
        Array.slice(win.document.querySelectorAll('a[href]')).concat(
            Array.map(win.frames, getLinks).reduce(function(a, b) a.concat(b), []))
    )(content);
    var collection = links.map(function(a)
        [(img = a.querySelector('img')) ? img.src : '', a.textContent.trim(), a.href]
    );
    prompt.selector({
        message     : 'Links',
        collection  : collection,
        flags       : [ICON, 0, 0],
        style       : [0, 0, style.prompt.url],
        header      : ['Title', 'URL'],
        onChange    : function (aArg)
            (aArg.row) ? selector.selectAndScroll(links[aArg.index]) : void(0),
        onFinish    : function (aArg)
            selector.destroy(),
        keymap      : {
            'RET'   : 'open',
            'S-RET' : 'open-background',
        },
        actions     : [
            [function(aIndex) plugins.hok.followLink(links[aIndex], plugins.hok.CURRENT_TAB),
            'Open', 'open'],
            [function(aIndex) plugins.hok.followLink(links[aIndex], plugins.hok.NEW_BACKGROUND_TAB),
            'Open in background', 'open-background'],
        ]
    });
}, 'Show links');

ext.add('submit-form', function(ev, arg) {
    var target = ev.originalTarget || ev.target;
    var result = util.getNodesFromXPath('//form', target);
    if (result.snapshotLength > 0)
        result.snapshotItem(0).submit();
}, 'Submit focused form');

(function () {
    function googleCompleter(args, extra) {
        let suggestions = util.suggest.google(extra.query || '');

        return { collection : suggestions, origin : extra.whole.indexOf(extra.left) };
    }

    shell.add("udic", "Urban dictionary", function (args, extra) {
        const base = "http://www.urbandictionary.com/define.php?term=%s";

        util.setBoolPref("accessibility.browsewithcaret", false);
        gBrowser.loadOneTab(util.format(base, encodeURIComponent(args[0])),
                            null, null, null, extra.bang);
    }, { bang: true, completer: googleCompleter });

    shell.add("goodic", M({ja: "Goo 辞書", en: "Goo dic"}), function (args, extra) {
        const base = "http://dictionary.goo.ne.jp/search.php?MT=%s&kind=all&mode=0&IE=UTF-8";

        util.setBoolPref("accessibility.browsewithcaret", false);
        gBrowser.loadOneTab(util.format(base, encodeURIComponent(args[0])),
                            null, null, null, extra.bang);
    }, { bang: true, completer: googleCompleter });
})();

ext.add('add-bookmark', function(ev, arg) {
    PlacesCommandHook.bookmarkCurrentPage(true, PlacesUtils.bookmarksMenuFolderId);
}, 'Add bookarmk');

ext.add('minimize-meory', function(ev, arg) {
    //CC
    var os = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
    window.QueryInterface(Ci.nsIInterfaceRequestor)
        .getInterface(Ci.nsIDOMWindowUtils)
        .cycleCollect();
    os.notifyObservers(null, "child-cc-request", null);

    //GC
    Cu.forceGC();
    os.notifyObservers(null, "child-gc-request", null);

    //Minimize memory
    var mrm = Cc["@mozilla.org/memory-reporter-manager;1"].getService(Ci.nsIMemoryReporterManager);
    mrm.minimizeMemoryUsage(() => display.echoStatusBar('Memory minimization completed', 1000));
}, 'Minimize memory usage');

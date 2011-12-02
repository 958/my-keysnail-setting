
//�ŋߕ����^�u
// http://d.hatena.ne.jp/mooz/20091123/p1
ext.add("list-closed-tabs", function () {
    const fav = "chrome://mozapps/skin/places/defaultFavicon.png";
    var ss   = Cc["@mozilla.org/browser/sessionstore;1"].getService(Ci.nsISessionStore);
    var json = Cc["@mozilla.org/dom/json;1"].createInstance(Ci.nsIJSON);
    var closedTabs = [[tab.image || fav, tab.title] for each (tab in json.decode(ss.getClosedTabData(window)))];
    if (!closedTabs.length)
        return void display.echoStatusBar("�ŋߕ����^�u��������܂���ł���", 2000);
    prompt.selector({
        message    : "select tab to undo:",
        collection : closedTabs,
        keymap     : util.extendDefaultKeymap(),
        flags      : [ICON | IGNORE, 0],
        callback   : function (i) { if (i >= 0) window.undoCloseTab(i); }
    });
}, "List closed tabs");

//�u���E�U�̖߂闚��
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

// ���ցA�O��
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
    ext.add("toggle-selected-tab", function() gBrowser.tabContainer.selectedIndex = prev, '�I���^�u���g�O������');
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
        callback    : function (i) { if (i >= 0) userscript.loadPlugin(plugins[i]); }
    });
}, "Load specified plugin");

// https://gist.github.com/225955
ext.add("edit-userchrome-css", function(){
    let file = util.getSpecialDir("UChrm");
    file.append("userChrome.css");
    userscript.editFile(file.path);
}, M({ja: "userChrome.css ��ҏW", en: "Edit userChrome.css"}));

ext.add("toggle-scroll-bar", function(){
    style.toggle(<><![CDATA[
        @namespace html url("http://www.w3.org/1999/xhtml");
        html|html > scrollbar { visibility: collapse !important; }
    ]]></>, [style.XHTML, style.XUL].join(""), true);
}, "�X�N���[���o�[�̕\����؂�ւ���");

ext.add("google-search", function(ev, arg) {
    let engines = util.suggest.getEngines();
    let suggestEngines = [util.suggest.ss.getEngineByName("Google")];
    util.suggest.searchWithSuggest(engines[0], suggestEngines, "tab");
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
                let text = content.document.getSelection().toString();
                if (text.length > 0)
                    openUILinkIn(engines[i].getSubmission(text, null).uri.spec, "tab");
                else
                    util.suggest.searchWithSuggest(engines[i], suggestEngines, "tab");
            }
        }
    });
}, "Search with Suggest");

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

            return util.format(<><![CDATA[
    %s : {
        preset: '',
        description: %s,
        type: %s
    }]]></>.toString(),
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

// http://d.hatena.ne.jp/sr10/20110129/1296290450
(function(){
    const targetLang = "ja"; // target lang to translate into
    const alternativeLang = "en"; // if given word is in targetLang, use this instead as a target lang
    const base = "https://www.googleapis.com/language/translate/v2?key=%s&q=%s&target=%s";
    const apikey = "AIzaSyBq48p8NhFgaJ1DfUJ5ltbwLxeXpjEL86A";

    let lastTranslated = "";

    function translate(word, target, next) {
        next("", "", " getting...");
        let ep = util.format(base, apikey, encodeURIComponent(word), target);
        util.httpGet(ep, false, function (res) {
            if (res.status === 200) {
                let json = JSON.parse(res.responseText);
                let srclang = json.data.translations[0].detectedSourceLanguage;
                if (target == srclang) {
                    lookupword(word, alternativeLang);
                } else {
                    let result = json.data.translations[0].translatedText;
                    next(srclang, target, result);
                }
            } else
                next("", "", "ERROR!");
        });
    };
    function echo(srclang, from, tglang, to)
        display.echoStatusBar(srclang + " : " + from + " -> " + tglang + " : " + to);
    function lookupword(word, target)
        translate(word, target, function (src, tg, translated) echo(src, word, tg, lastTranslated = translated));
    function read (aInitialInput) {
        let prevText = "";
        lastTranslated = "";
        prompt.reader({
            message         : "word or sentence to translate:",
            initialinput    : aInitialInput,
            onChange        : function (arg) {
                let word = arg.textbox.value.trim();
                if (word !== prevText)
                    lookupword(prevText = word, targetLang);
            },
            callback: function (s) command.setClipboardText(lastTranslated),
        });
    }
    ext.add("google-itranslate",function() read(content.document.getSelection().toString() || ""), "google itranslate");
})();

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
}, "HTML �̃^�O��}��");

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

ext.add('go-nickname', function(ev, arg) {
    const openMode = "tab";
    let bmsvc = Cc['@mozilla.org/browser/nav-bookmarks-service;1']
        .getService(Ci.nsINavBookmarksService);
    let keywords = function () {
        let ios = Cc['@mozilla.org/network/io-service;1']
            .getService(Ci.nsIIOService);
        return function (aItemId) {
            let ret = [];
            let parentNode = PlacesUtils.getFolderContents(aItemId).root;
            for (let i = 0; i < parentNode.childCount; i++) {
                let childNode = parentNode.getChild(i);
                if (PlacesUtils.nodeIsBookmark(childNode)) {
                    let uri = ios.newURI(childNode.uri, null, null);
                    let keyword = bmsvc.getKeywordForURI(uri);
                    if (keyword) {ret.push(keyword);}
                } else if (PlacesUtils.nodeIsFolder(childNode) && !PlacesUtils.nodeIsLivemarkContainer(childNode)) {
                    ret = ret.concat(arguments.callee(childNode.itemId));
                }
            }
            return ret;
        }(1).filter(function (elem, index, array) array.indexOf(elem) == index);
    }();
    prompt.reader({
        message: "Go Nickname:",
        onChange: function (arg) {
            var value = arg.textbox.value;
            var matchKeywords = keywords.filter(function (elem) elem.indexOf(value) === 0);
            if (matchKeywords.length === 1) {
                plugins.bmany.go(bmsvc.getURIForKeyword(matchKeywords[0]).spec, openMode);
                prompt.finish(true);
            }
        },
        callback: function (value) plugins.bmany.go(getShortcutOrURI(value, {}).spec, openMode)
    });
}, '�u�b�N�}�[�N�̃L�[���[�h���瑦���ɊJ��');

// via http://www.pshared.net/diary/20091004.html
ext.add('copy-page-info', function(ev, arg) {
    const templates = {
        'Title'                 : "{0}",
        'URL'                   : "{1}",
        'Shorten URL'           : function(title, url, callback) plugins.lib.shortenURL(url, callback),
        'Title and URL'         : "{0}\n{1}",
        'Link (URL)'            : "<a href=\"{1}\"></a>",
        'Link (Title and URL)'  : "<a href=\"{1}\">{0}</a>",
        'pukiwiki'              : "[[{0}:{1}]]",
    };

    function format() {
        let args = Array.prototype.slice.apply(arguments);
        let format = args.shift();
        return format && format.replace(/\{(\d)\}/g, function() args[arguments[1]] || "");
    }

    function yank(text) {
        command.setClipboardText(text);
        display.echoStatusBar('Yanked ' + text);
    }

    let promptList = [key for (key in templates)];

    prompt.selector({
        message    : "copy from :",
        collection : promptList,
        keymap     : util.extendDefaultKeymap(),
        callback   : function (aIndex) {
            if (aIndex < 0) return;
            let key = promptList[aIndex];
            let template = templates[key];
            if (typeof (template) == 'string')
                yank(format(template, content.document.title, content.location.href));
            else
                template(content.document.title, content.location.href, yank);
        }
    });
}, '�^�C�g����URL���R�s�[');

ext.add('copy-gist-plugin-info', function(ev, arg) {
    const text = content.document.querySelectorAll('pre')[1].textContent;
    const keys = ['name', 'description lang="ja"', 'updateURL', 'iconURL'];
    const template = (<><![CDATA[
<tr>
<td><img src="%iconURL%"></td>
<td style="vertical-align:middle"><a href="%URL%">%name%</a></td>
<td style="vertical-align:middle">%description lang="ja"%</td>
<td style="vertical-align:middle"><a href="%updateURL%">Install</a></td>
</tr>
]]></>).toString();
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
    window.XMigemoFind.findNext(true);
}, 'XULMigemo find next');

ext.add('xulmigemo-find-prev', function(ev, arg) {
    window.XMigemoFind.findPrevious(true);
}, 'XULMigemo find previous');

ext.add('toggle-statusbar-icon', function(ev, arg) {
    style.toggle(<><![CDATA[
#keysnail-status,
#keysnail-prefer-ldrize-container,
#refcontrol-status-panel,
#keysnail-twitter-client-container,
#gmail-checker-status-panel
{
    visibility: collapse !important;
}
    ]]></>, [style.XHTML, style.XUL].join(""), true);
}, 'Toggle statusbar icon');

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

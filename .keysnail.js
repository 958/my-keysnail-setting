// ========================== KeySnail Init File =========================== //

// この領域は, GUI により設定ファイルを生成した際にも引き継がれます
// 特殊キー, キーバインド定義, フック, ブラックリスト以外のコードは, この中に書くようにして下さい
// ========================================================================= //
//{{%PRESERVE%
//
// ===== Options ===

// migemo
prompt.useMigemo = true;
prompt.migemoMinWordLength = 3;

// ===== Load sub files =====
(function() {
    try {
        util.readDirectory(util.getExtensionLocalDirectoryRoot(), true)
            .filter(function (file) !(/^\.keysnail\.js$/i.test(file.leafName) ||
                                      !/\.keysnail\.js$/i.test(file.leafName) ||
                                      file.isDirectory()))
            .sort()
            .forEach(function (file) {
                util.message('Load sub setting files: ' + file.leafName);
                userscript.loadSubScript(file.path, modules, true);
            });
    } catch (ex) { util.message(ex); }
})();

//}}%PRESERVE%
// ========================================================================= //

// ========================= Special key settings ========================== //

key.quitKey              = "ESC";
key.helpKey              = "<f1>";
key.escapeKey            = "Not defined";
key.macroStartKey        = "S-<f11>";
key.macroEndKey          = "S-<f12>";
key.universalArgumentKey = "M--";
key.negativeArgument1Key = "Not defined";
key.negativeArgument2Key = "Not defined";
key.negativeArgument3Key = "Not defined";
key.suspendKey           = "C-<f12>";

// ================================= Hooks ================================= //

hook.setHook('MenuPopupShowing', function stopKeySnail(ev) {
    key.suspended = true;
});

hook.setHook('MenuPopupHiding', function restartKeySnail(ev) {
    key.suspended = false;
});

hook.setHook('KeyBoardQuit', function (aEvent) {
    if (key.currentKeySequence.length)
        return;
    command.closeFindBar();
    if ("allTabs" in window && allTabs.isOpen)
        allTabs.close();
    if (aEvent.target !== document.getElementById("keysnail-prompt-textbox"))
        try {
            prompt.finish(true);
        } catch(e) { }
    util.message(KeySnail.windowType);
    if (KeySnail.windowType != "navigator:browser")
        window.close();
    if (util.isCaretEnabled()) {
        if (command.marked(aEvent))
            command.resetMark(aEvent);
        util.setBoolPref("accessibility.browsewithcaret", false);
    } else
        goDoCommand("cmd_selectNone");
    if (KeySnail.windowType === "navigator:browser")
        key.generateKey(aEvent.originalTarget, KeyEvent.DOM_VK_ESCAPE, true);
    if ("blur" in aEvent.target)
        aEvent.target.blur();
    if (typeof gBrowser != "undefined")
        gBrowser.focus();
    if (content)
        content.focus();
});





// ============================= Key bindings ============================== //

key.setGlobalKey('C-^', function (ev, arg) {
    ext.exec("toggle-selected-tab", arg, ev);
}, '選択タブをトグルする', true);

key.setGlobalKey('C-k', function (ev, arg) {
    ext.exec("search-with-suggest", arg, ev);
}, 'Search With Suggest', true);

key.setGlobalKey('C-:', function (ev, arg) {
    ext.exec("ldrnail-toggle-status", arg, ev);
}, 'LDRnail - 優先状態の切り替え', true);

key.setGlobalKey('M-x', function (ev, arg) {
    ext.select(arg, ev);
}, 'エクステ一覧表示', true);

key.setGlobalKey('M-:', function (ev, arg) {
    ext.exec('command-interpreter', arg, ev);
}, 'JavaScript のコードを評価');

key.setGlobalKey('C-n', function (ev, arg) {
    ext.exec('select-next-tab', arg, ev);
}, 'ひとつ右のタブへ');

key.setGlobalKey('C-p', function (ev, arg) {
    ext.exec('select-previous-tab', arg, ev);
}, 'ひとつ左のタブへ');

key.setGlobalKey(['C-m', 't'], function (ev, arg) {
    style.toggle('#tabbrowser-tabs { visibility:collapse; }');
}, 'タブ表示をトグル');

key.setGlobalKey(['C-\\', 'C-c'], function (ev, arg) {
    ext.exec("clear-cache", arg, ev);
}, 'キャッシュクリア');

key.setGlobalKey(['C-\\', 'k', 'r'], function (ev, arg) {
    userscript.reload();
}, 'KeySnail 設定ファイルを再読み込み');

key.setGlobalKey(['C-\\', 'k', 'e'], function (ev, arg) {
    KeySnail.modules.userscript.editInitFile();
}, 'KeySnail 設定ファイルを編集');

key.setGlobalKey(['C-\\', 'k', 'p'], function (ev, arg) {
    KeySnail.openPreference();
}, 'KeySnail 設定画面を開く');

key.setGlobalKey(['C-\\', 'k', 'o'], function (ev, arg) {
    ext.exec("option-migrator", arg, ev);
}, 'Option migrator');

key.setGlobalKey(['C-\\', 'k', 'P'], function (ev, arg) {
    KeySnail.modules.userscript.openPluginManager();
}, 'KeySnail プラグインマネージャを開く');

key.setGlobalKey(['C-\\', 'C-k'], function (ev, arg) {
    ext.exec("reload-plugin", arg, ev);
}, 'KeySnail プラグインをリロード');

key.setGlobalKey(['C-\\', 'C-a'], function (ev, arg) {
    ext.exec("firefox-addon-manager-show", arg, ev);
}, 'アドオンマネージャ');

key.setGlobalKey(['C-\\', 's'], function (ev, arg) {
    ext.exec("user-script-manager-show-menu-command", arg, ev);
}, 'ユーザスクリプトマネージャ メニューコマンドを実行');

key.setGlobalKey(['C-\\', 'C-s'], function (ev, arg) {
    ext.exec("user-script-manager-show", arg, ev);
}, 'ユーザスクリプトマネージャ');

key.setGlobalKey(['C-\\', 'C-p'], function (ev, arg) {
    ext.exec("firefox-plugin-manager-show", arg, ev);
}, 'プラグインマネージャ');

key.setGlobalKey(['C-\\', 'p', 'f'], function (ev, arg) {
    ext.exec("firefox-plugin-manager-disable", "flash|silverlight", ev);
}, 'Flash と Silverlight を無効');

key.setGlobalKey(['C-\\', 'p', 'F'], function (ev, arg) {
    ext.exec("firefox-plugin-manager-enable", "flash|silverlight", ev);
}, 'Flash と Silverlight を有効');

key.setGlobalKey(['C-\\', 'i'], function (ev, arg) {
    ext.exec("toggle-statusbar-icon", arg, ev);
}, 'アドオンバーのアイコン表示をトグル', true);

key.setGlobalKey(['C-\\', 'c', 'r'], function (ev, arg) {
    plugins.cookieManager.removeCookiesByHost(content.location.host);
}, 'Cookie Manager - 現在のホストのクッキーを削除', true);

key.setGlobalKey(['C-\\', 'c', 'l'], function (ev, arg) {
    ext.exec("cookie-manager-show-list", content.location.host, ev);
}, 'Cookie Manager - 現在のホストのクッキーを表示', true);

key.setGlobalKey(['C-\\', 'c', 'a'], function (ev, arg) {
    ext.exec("cookie-manager-show-list", arg, ev);
}, 'Cookie Manager - 全てのクッキーを表示', true);

key.setGlobalKey(['C-\\', 'D'], function (ev, arg) {
    ext.exec("optimize-sqlite", arg, ev);
}, 'places.sqlite を最適化');

key.setGlobalKey(['C-\\', 'm'], function (ev, arg) {
    ext.exec("show-memory-report", arg, ev);
}, 'about:memory');

key.setGlobalKey(['C-\\', 'C-\\'], function (ev, arg) {
    var files = ["addons.sqlite", "chromeappsstore.sqlite", "content-prefs.sqlite", "cookies.sqlite", "downloads.sqlite", "evernote_webclipper.sqlite", "extensions.sqlite", "feedbar.sqlite", "firegestures.sqlite", "formhistory.sqlite", "linkpad.sqlite", "permissions.sqlite", "readItLater.sqlite", "search.sqlite", "signons.sqlite", "urlclassifier3.sqlite", "webappsstore.sqlite", ];
    var workerJS = util.pathToURL(userscript.pluginDir + userscript.directoryDelimiter + "vacuum.js");
    util.fbug(workerJS);
    var thread = function () {for (let i = 0; i < files.length; i++) {display.echoStatusBar(files[i] + " Optimizing ...");var worker = new Worker(workerJS);worker.onmessage = function (event) {thread.next();};worker.postMessage(files[i]);yield;}display.echoStatusBar("Done !");}();
    thread.next();
}, 'test');

key.setGlobalKey(['C-,', 'C-a'], function (ev, arg) {
    var cmd = document.getElementById("jid0-tKjnEA5X3eBoP5HnqjBYQ4U3AcM-context-menu-item-1");
    if (cmd) {
        cmd.doCommand();
    }
}, 'Autopagerize の設定画面を表示');

key.setGlobalKey(['C-,', 'a'], function (ev, arg) {
    var ev = window.content.document.createEvent("Event");
    ev.initEvent("AutoPagerizeToggleRequest", true, false);
    window.content.document.dispatchEvent(ev);
}, 'Autopagerize の状態をトグル');

key.setGlobalKey(['C-,', 't', 'j'], function (ev, arg) {
    ext.exec("multi-request", "googletrans-ja,so-net-e2j ", ev);
}, '日本語に翻訳', true);

key.setGlobalKey(['C-,', 't', 'e'], function (ev, arg) {
    ext.exec("multi-request", "googletrans-en,so-net-j2e ", ev);
}, '英語に翻訳');

key.setGlobalKey(['C-,', 't', 'a'], function (ev, arg) {
    ext.exec("multi-request", "alc,goo ", ev);
}, '単語翻訳');

key.setGlobalKey(['C-,', 't', 'i'], function (ev, arg) {
    ext.exec("mstranslator-open-prompt", arg, ev);
}, 'MSTranslator - プロンプトを表示');

key.setGlobalKey(['C-,', 'f', 'o'], function (ev, arg) {
    ext.exec("firebug-open", arg, ev);
}, 'Firebug - open', true);

key.setGlobalKey(['C-,', 'f', 'f'], function (ev, arg) {
    ext.exec("firebug-off", arg, ev);
}, 'Firebug - off', true);

key.setGlobalKey(['C-,', 'f', 'r'], function (ev, arg) {
    ext.exec("firebug-console-clear", arg, ev);
}, 'Firebug - console-clear', true);

key.setGlobalKey(['C-,', 'f', 'c'], function (ev, arg) {
    ext.exec("firebug-console-focus", arg, ev);
}, 'Firebug - console-focus', true);

key.setGlobalKey(['C-,', 'f', 't'], function (ev, arg) {
    ext.exec("firebug-tab", arg, ev);
}, 'Firebug - tab', true);

key.setGlobalKey(['C-,', 'd'], function (ev, arg) {
    ext.exec("dlbsnail-show-file-list", arg, ev);
}, 'Show Download Statusbar Items', true);

key.setGlobalKey(['C-,', 'C-d'], function (ev, arg) {
    ext.exec("dlbsnail-show-command-for-all", arg, ev);
}, 'dlbasnail-all系コマンド', true);

key.setGlobalKey(['C-,', 'g', 'T'], function (ev, arg) {
    ext.exec("google-tasks-create", arg, ev);
}, 'Google Tasks - Create task', true);

key.setGlobalKey(['C-,', 'g', 't'], function (ev, arg) {
    ext.exec("google-tasks-show-tasks", arg, ev);
}, 'Google Tasks - Show tasks', true);

key.setGlobalKey(['C-,', 'g', 'm'], function (ev, arg) {
    ext.exec("gpum-show-unread-list", arg, ev);
}, 'gpum - 新着メールを表示', true);

key.setGlobalKey(['C-,', 'g', 'M'], function (ev, arg) {
    ext.exec("gpum-check-new-mail", arg, ev);
}, 'gpum - 新規メールを確認', true);

key.setGlobalKey(['C-,', 'g', 'C-m'], function (ev, arg) {
    ext.exec("gpum-login", arg, ev);
}, 'gpum - ログイン', true);

key.setGlobalKey(['C-,', 'g', 'c'], function (ev, arg) {
    ext.exec("google-calendar-show-all-events", arg, ev);
}, 'Google Calendar - 全てのイベント一覧', true);

key.setGlobalKey(['C-,', 'g', 'C'], function (ev, arg) {
    ext.exec("google-calendar-create-event", arg, ev);
}, 'Google Calendar - イベントを作成', true);

key.setGlobalKey(['C-,', 'g', 'C-c'], function (ev, arg) {
    ext.exec("google-calendar-update-calendars", arg, ev);
}, 'Google Calendar - カレンダーキャッシュを更新', true);

key.setGlobalKey(['C-,', 'r', '.'], function (ev, arg) {
    plugins.heavens.dotnet.open();
}, '.NET Documentcを開く');

key.setGlobalKey(['C-,', 'r', 'j'], function (ev, arg) {
    ext.exec("JsReferrence-open-prompt", arg, ev);
}, 'JsReference で検索を開始する', true);

key.setGlobalKey(['C-,', 'h', 'a'], function (ev, arg) {
    ext.exec("hab-add", arg, ev);
}, '支出を追加');

key.setGlobalKey(['C-,', 'h', 'l'], function (ev, arg) {
    ext.exec("hab-show", arg, ev);
}, '支出をリスト表示');

key.setGlobalKey(['C-,', 'h', 'c'], function (ev, arg) {
    ext.exec("hab-show-chart", arg, ev);
}, '支出をグラフ表示');

key.setGlobalKey('C-s', function (ev, arg) {
    ext.exec("quick-google", arg, ev);
}, 'Quick bing', true);

key.setGlobalKey(['C-;', 'b'], function (ev, arg) {
    var elem = document.commandDispatcher.focusedElement;
    if (elem) {
        elem.blur();
    }
    gBrowser.focus();
    _content.focus();
}, 'コンテンツへフォーカス');

key.setGlobalKey(['C-;', 'p'], function (ev, arg) {
    var p = document.getElementById("keysnail-prompt");
    if (p.hidden) {
        return;
    }
    document.getElementById("keysnail-prompt-textbox").focus();
}, 'プロンプトへフォーカス');

key.setViewKey('u', function (ev) {
    undoCloseTab();
}, '閉じたタブを元に戻す');

key.setViewKey('U', function (ev, arg) {
    ext.exec("list-closed-tabs", arg, ev);
}, 'List closed tabs', true);

key.setViewKey('t', function (ev, arg) {
    shell.input("tabopen ");
}, 'Tab open', true);

key.setViewKey('T', function (ev, arg) {
    var tab = gBrowser.mCurrentTab;
    tab.pinned ? gBrowser.unpinTab(tab) : gBrowser.pinTab(tab);
}, 'ピン留めのトグル');

key.setViewKey('H', function (ev, arg) {
    ext.exec('back', arg, ev);
}, '戻る');

key.setViewKey('L', function (ev, arg) {
    ext.exec('forward', arg, ev);
}, '進む');

key.setViewKey(['g', 'i'], function (ev, arg) {
    ext.exec('focus-to-the-first-textarea', arg, ev);
}, '最初のインプットエリアへフォーカス');

key.setViewKey(['g', 't'], function (ev, arg) {
    ext.exec('select-next-tab', arg, ev);
}, 'ひとつ右のタブへ');

key.setViewKey(['g', 'T'], function (ev, arg) {
    ext.exec('select-previous-tab', arg, ev);
}, 'ひとつ左のタブへ');

key.setViewKey(['g', 'u'], function (ev, arg) {
    ext.exec("upper-directory", arg, ev);
}, '一つ上のディレクトリへ移動');

key.setViewKey(['g', 'U'], function (ev, arg) {
    ext.exec("goto-root", arg, ev);
}, 'ルートディレクトリへ移動');

key.setViewKey(['g', 'g'], function (ev, arg) {
    ext.exec('scroll-to-the-top-of-the-page', arg, ev);
}, 'ページ先頭へ移動');

key.setViewKey(['g', 'h'], function (ev, arg) {
    openUILinkIn("about:blank", "current");
}, 'about:blank を開く');

key.setViewKey(['g', 'H'], function (ev, arg) {
    ext.exec('open-the-new-tab', arg, ev);
}, 'タブを開く');

key.setViewKey(['g', 'l'], function (ev, arg) {
    var n = gBrowser.mCurrentTab._tPos;
    gBrowser.moveTabTo(gBrowser.mCurrentTab, gBrowser.mTabContainer.childNodes.length - 1);
    gBrowser.selectedTab = gBrowser.mTabs[n];
}, 'タブを最後尾に移動');

key.setViewKey(['g', 'f'], function (ev, arg) {
    ext.exec('select-next-frame', arg, ev);
}, '次のフレームを選択');

key.setViewKey(['g', 'n'], function (ev, arg) {
    ext.exec("show-links", arg, ev);
}, 'Show links', true);

key.setViewKey(['b', 'a'], function (ev, arg) {
    ext.exec("add-bookmark", arg, ev);
}, 'お気に入りに追加', true);

key.setViewKey(['b', 'b'], function (ev, arg) {
    ext.exec("bmany-list-all-bookmarks", arg, ev);
}, 'bmany - ブックマークを一覧表示', true);

key.setViewKey(['b', 'h'], function (ev, arg) {
    ext.exec("list-hateb-items", arg, ev);
}, 'はてなブックマークのアイテムを一覧表示しジャンプ', true);

key.setViewKey(['b', 'j'], function (ev, arg) {
    ext.exec("bmany-list-bookmarklets", arg, ev);
}, 'bmany - ブックマークレットを一覧表示', true);

key.setViewKey(['b', 'k'], function (ev, arg) {
    ext.exec("bmany-list-bookmarks-with-keyword", arg, ev);
}, 'bmany - キーワード付きブックマークを一覧表示', true);

key.setViewKey(['b', 'd'], function (ev, arg) {
    ext.exec("bookmark-folder-show", arg, ev);
}, 'ブックマークフォルダを一覧表示', true);

key.setViewKey(['b', 'l'], function (ev, arg) {
    ext.exec("live-bookmark-select-folder", arg, ev);
}, 'ライブブックマークを一覧表示', true);

key.setViewKey(['w', 'd', 'n'], function (ev, arg) {
    ext.exec("close-all-tabs-on-right", arg, ev);
}, '右側のタブを全て閉じる', true);

key.setViewKey(['w', 'd', 'p'], function (ev, arg) {
    ext.exec("close-all-tabs-on-left", arg, ev);
}, '左側のタブを全て閉じる', true);

key.setViewKey([['w', 'w'], ['d']], function (ev) {
    BrowserCloseTabOrWindow();
}, 'タブ / ウィンドウを閉じる');

key.setViewKey(['w', 'q'], function (ev, arg) {
    ext.exec("ril-append-and-close", arg, ev);
}, 'RIL - 現在のタブを RIL に追加してタブを閉じる', true);

key.setViewKey(['w', 'g', 'l'], function (ev, arg) {
    ext.exec("tabgroup-list", arg, ev);
}, 'Show tabgroup list', true);

key.setViewKey(['w', 'g', 'j'], function (ev, arg) {
    ext.exec("tabgroup-next", arg, ev);
}, 'Next tabgroup');

key.setViewKey(['w', 'g', 'k'], function (ev, arg) {
    ext.exec("tabgroup-prev", arg, ev);
}, 'Previous tabgroup');

key.setViewKey(['w', 'g', 'c'], function (ev, arg) {
    ext.exec("tabgroup-create", arg, ev);
}, 'Create new tabgroup', true);

key.setViewKey(['w', 'g', 'd'], function (ev, arg) {
    ext.exec("tabgroup-close", arg, ev);
}, 'Close current tabgroup', true);

key.setViewKey('q', function (ev, arg) {
    display.echoStatusBar((new Date).toString(), 5000);
}, 'View time now', true);

key.setViewKey(['h', 'h'], function (ev, arg) {
    ext.exec("history-show", arg, ev);
}, 'History - リストを表示', true);

key.setViewKey(['h', 'H'], function (ev, arg) {
    ext.exec("google-web-history-search", arg, ev);
}, 'Google Web History - Google Web 履歴を検索', true);

key.setViewKey(['h', 'l'], function (ev, arg) {
    ext.exec("list-tab-history", arg, ev);
}, 'List tab history', true);

key.setViewKey('*', function (ev, arg) {
    ext.exec('focus-to-the-location-bar', arg, ev);
}, 'ロケーションバーへフォーカス', true);

key.setViewKey(':', function (ev, arg) {
    ext.exec('list-command', arg, ev);
}, 'コマンドの実行', true);

key.setViewKey('f', function (ev, arg) {
    ext.exec("hok-start-foreground-mode", arg);
}, 'HoK - リンクをフォアグラウンドで開く', true);

key.setViewKey('F', function (ev, arg) {
    ext.exec("hok-start-background-mode", arg);
}, 'HoK - リンクをバックグラウンドで開く', true);

key.setViewKey(';', function (ev, arg) {
    ext.exec("hok-start-extended-mode", arg);
}, 'HoK - 拡張ヒントモードを開始', true);

key.setViewKey('+', function (ev, arg) {
    ext.exec("hok-start-continuous-mode", arg);
}, 'HoK - リンクを連続して開く', true);

key.setViewKey('A', function (ev, arg) {
    ext.exec("tanything", arg, ev);
}, 'タブを一覧表示', true);

key.setViewKey('a', function (ev, arg) {
    ext.exec("tanything", arg, ev);
    prompt.editModeEnabled = true;
}, 'タブを一覧表示', true);

key.setViewKey('c', function (ev, arg) {
    ext.exec("list-hateb-comments", arg, ev);
}, 'このページのはてなブックマークコメントを一覧表示', true);

key.setViewKey('C', function (ev, arg) {
    openUILinkIn("http://b.hatena.ne.jp/entry?mode=more&url=" + encodeURIComponent(content.location.href), "tab");
}, 'このページのはてなブックマークコメントを表示', true);

key.setViewKey('G', function (ev, arg) {
    ext.exec('scroll-to-the-bottom-of-the-page', arg, ev);
}, 'ページ末尾へ移動');

key.setViewKey('r', function (ev, arg) {
    ext.exec('reload-the-page', arg, ev);
}, '更新');

key.setViewKey('R', function (ev, arg) {
    ext.exec('reload-the-page-ignore-cache', arg, ev);
}, '更新(キャッシュを無視)');

key.setViewKey('s', function (ev, arg) {
    ext.exec("google-search", arg, ev);
}, 'Search with Suggest');

key.setViewKey('S', function (ev, arg) {
    ext.exec("google-search-in-site", arg, ev);
}, 'Site Search with Suggest');

key.setViewKey('/', function (ev, arg) {
    command.iSearchForwardKs(ev);
}, 'Migemo 検索', true);

key.setViewKey('?', function (ev, arg) {
    command.iSearchBackwardKs(ev);
}, 'Migemo 検索', true);

key.setViewKey('n', function (ev, arg) {
    ext.exec("xulmigemo-find-next", arg, ev);
}, 'Migemo 検索 - 次へ', true);

key.setViewKey('N', function (ev, arg) {
    ext.exec("xulmigemo-find-prev", arg, ev);
}, 'Migemo 検索 - 前へ', true);

key.setViewKey([['\\', '\\'], ['\\', 't']], function (ev, arg) {
    ext.exec("find-current-tab", arg, ev);
}, 'Find - 現在のタブを検索', true);

key.setViewKey(['\\', '_'], function (ev, arg) {
    ext.exec("find-current-tab-link-text-and-url", arg, ev);
}, 'Find - 現在のタブのリンクを検索', true);

key.setViewKey(['\\', 'l'], function (ev, arg) {
    ext.exec("find-current-tab-link-url", arg, ev);
}, 'Find - 現在のタブのリンク URL を検索', true);

key.setViewKey(['\\', 'T'], function (ev, arg) {
    ext.exec("find-all-tab", arg, ev);
}, 'Find - 全てのタブを検索', true);

key.setViewKey(['\\', 'L'], function (ev, arg) {
    ext.exec("find-all-tab-link-text-and-url", arg, ev);
}, 'Find - 全てのタブのリンクを検索', true);

key.setViewKey('i', function (ev, arg) {
    util.setBoolPref("accessibility.browsewithcaret", !util.getBoolPref("accessibility.browsewithcaret"));
}, 'Toggle Caret Mode');

key.setViewKey('e', function (ev, arg) {
    ext.exec("go-to-keyword", arg, ev);
}, 'Open keyword bookmark');

key.setViewKey('j', function (ev, arg) {
    ext.exec('next-line', arg, ev);
}, '一行スクロールダウン');

key.setViewKey('k', function (ev, arg) {
    ext.exec('previous-line', arg, ev);
}, '一行スクロールアップ');

key.setViewKey([['J'], ['C-d']], function (ev, arg) {
    ext.exec("scrollet-scroll-document-down", arg, ev);
}, '半画面スクロールダウン', true);

key.setViewKey([['K'], ['C-u']], function (ev, arg) {
    ext.exec("scrollet-scroll-document-up", arg, ev);
}, '半画面スクロールアップ', true);

key.setViewKey('C-f', function (ev, arg) {
    ext.exec('page-down', arg, ev);
}, '一画面スクロールダウン');

key.setViewKey('C-b', function (ev, arg) {
    ext.exec('page-up', arg, ev);
}, '一画面スクロールアップ');

key.setViewKey(['m', 's'], function (ev, arg) {
    ext.exec("scrollet-set-mark", arg, ev);
}, '現在のスクロール位置 / キャレット位置を保存', true);

key.setViewKey(['m', 'j'], function (ev, arg) {
    ext.exec("scrollet-jump-to-mark", arg, ev);
}, 'マークに保存された位置へジャンプ', true);

key.setViewKey('y', function (ev, arg) {
    ext.exec('copy-document-url', arg, ev);
}, 'ページの URL をコピー');

key.setViewKey('Y', function (ev, arg) {
    ext.exec("copy-page-info", arg, ev);
}, 'タイトルやURLをコピー');

key.setViewKey('C-Y', function (ev, arg) {
    ext.exec("copy-gist-plugin-info", arg, ev);
}, 'Copy gist plugin info');

key.setViewKey('p', function (ev, arg) {
    ext.exec('open-url-from-clipboard', arg, ev);
}, 'open_url_from_clipboard');

key.setViewKey('P', function (ev, arg) {
    const regexpLikeURL = new RegExp("(?:https?|ftp)://[-_.!~*'a-zA-Z0-9;?:@&=+$,%#/]+", "g");
    command.getClipboardText().match(regexpLikeURL).forEach((function (url) openUILinkIn(url, "tabshifted")));
}, 'open_urls_from_clipboard');

key.setViewKey('E', function (ev, arg) {
    ext.exec("set-encoding", arg, ev);
}, 'エンコーディングを切り替える');

key.setViewKey(['v', ']'], function (ev, arg) {
    ext.exec("div-scroller-shift-scroll-element-inclement", arg, ev);
}, 'Shift scroll element', true);

key.setViewKey(['v', '['], function (ev, arg) {
    ext.exec("div-scroller-shift-scroll-element-declement", arg, ev);
}, 'Shift scroll element', true);

key.setViewKey(['v', 'j'], function (ev, arg) {
    ext.exec("div-scroller-scroll-down", arg, ev);
}, 'Scroll down');

key.setViewKey(['v', 'k'], function (ev, arg) {
    ext.exec("div-scroller-scroll-up", arg, ev);
}, 'Scroll up');

key.setViewKey([']', ']'], function (ev, arg) {
    ext.exec("follow-next-link", arg, ev);
}, 'follow next link', true);

key.setViewKey(['[', '['], function (ev, arg) {
    ext.exec("follow-prev-link", arg, ev);
}, 'follow previous link', true);

key.setViewKey([',', 's'], function (ev, arg) {
    openUILinkIn("view-source:" + content.location.href, "tab");
}, 'ソースを表示');

key.setViewKey([',', 'F'], function (ev, arg) {
    ext.exec("feed-show", arg, ev);
}, 'Feed購読');

key.setViewKey([',', 't', 'l'], function (ev, arg) {
    ext.exec("twitter-client-display-timeline", arg, ev);
}, 'TL を表示', true);

key.setViewKey([',', 't', 't'], function (ev, arg) {
    ext.exec("twitter-client-tweet", arg, ev);
}, 'つぶやく', true);

key.setViewKey([',', 't', 'T'], function (ev, arg) {
    ext.exec("twitter-client-tweet-this-page", arg, ev);
}, 'このページのタイトルと URL を使ってつぶやく', true);

key.setViewKey([',', 'r'], function (ev, arg) {
    ext.exec("kungfloo-reblog", arg, ev);
}, 'Kungfloo - Reblog', true);

key.setViewKey([',', 'R'], function (ev, arg) {
    ext.exec("kungfloo-tombloo-menu", arg, ev);
}, 'Kungfloo - Tombloo Menu', true);

key.setViewKey([',', 'e'], function (ev, arg) {
    let selected = (document.commandDispatcher.focusedWindow || gBrowser.contentWindow).getSelection().toString();
    if (selected.length > 0)
        window.evernote_doAction(document.popupNode, 'CLIP_ACTION_SELECTION');
    else
        window.evernote_doAction(document.popupNode, 'CLIP_ACTION_FULL_PAGE');
}, 'Evernote Clip', true);

key.setViewKey([',', 'E'], function (ev, arg) {
    window.evernote_doAction();
}, 'Evernote Clip', true);

key.setViewKey([',', 'l', 'l'], function (ev, arg) {
    ext.exec("ril-show-reading-list", arg, ev);
}, 'RIL - リストを表示', true);

key.setViewKey([',', 'l', 'a'], function (ev, arg) {
    ext.exec("ril-append", arg, ev);
}, 'RIL - 現在のタブを RIL に追加', true);

key.setViewKey([',', 'l', 'd'], function (ev, arg) {
    ext.exec("ril-remove", arg, ev);
}, 'RIL - 現在のタブを RIL から削除', true);

key.setViewKey([',', 'l', 't'], function (ev, arg) {
    ext.exec("ril-toggle", arg, ev);
}, 'RIL - 現在のタブを RIL に追加 または 削除', true);

key.setViewKey([',', 'f', 'n'], function (ev, arg) {
    ext.exec("facebook-show-news-feed", arg, ev);
}, 'facebook - ニュースフィード', true);

key.setViewKey([',', 'f', 'w'], function (ev, arg) {
    ext.exec("facebook-show-my-wall", arg, ev);
}, 'facebook - 自分のウォール', true);

key.setViewKey([',', 'f', 'f'], function (ev, arg) {
    ext.exec("facebook-show-friends-wall", arg, ev);
}, 'facebook - 友達のウォール', true);

key.setViewKey([',', 'f', 'p'], function (ev, arg) {
    ext.exec("facebook-post-text", arg, ev);
}, 'facebook - 投稿', true);

key.setViewKey([',', 'f', 'P'], function (ev, arg) {
    ext.exec("facebook-post-this-page", arg, ev);
}, 'facebook - 表示中のページを投稿', true);

key.setViewKey([',', 'f', 'F'], function (ev, arg) {
    ext.exec("facebook-post-to-friends-wall", arg, ev);
}, 'facebook - 友達のウォールに投稿', true);

key.setViewKey([',', 'f', 'm'], function (ev, arg) {
    ext.exec("facebook-show-inbox", arg, ev);
}, 'facebook - メッセージを表示', true);

key.setViewKey([',', 'g', 'i'], function (ev, arg) {
    ext.exec("gs-in", arg, ev);
}, 'Group session In', true);

key.setViewKey([',', 'g', 'o'], function (ev, arg) {
    ext.exec("gs-out", arg, ev);
}, 'Group session Out', true);

key.setViewKey([',', ',', 'g'], function (ev, arg) {
    ext.exec("login-manager-login", "google ", ev);
}, 'Log In (google.com)', true);

key.setViewKey([',', ',', 'h'], function (ev, arg) {
    ext.exec("login-manager-login", "hatena ", ev);
}, 'Log In (hatena)', true);

key.setViewKey([',', ',', 'l'], function (ev, arg) {
    ext.exec("login-manager-login", arg, ev);
}, 'Log In (All)', true);

key.setViewKey([',', ',', 'L'], function (ev, arg) {
    ext.exec("login-manager-logout", arg, ev);
}, 'Log Out (LoginManager)', true);

key.setViewKey([',', 'a', 'l'], function (ev, arg) {
    ext.exec("foxage2ch-show-threads");
}, 'FoxAge2ch - Show threads', true);

key.setViewKey([',', 'a', 'r'], function (ev, arg) {
    ext.exec("foxage2ch-check-updates");
}, 'FoxAge2ch - Check updates', true);

key.setViewKey([',', 'a', 'o'], function (ev, arg) {
    ext.exec("foxage2ch-open-updates");
}, 'FoxAge2ch - Show updates', true);

key.setViewKey([',', 'm', 'm'], function (ev, arg) {
    ext.exec("linker-send-current-url");
}, 'Linker- Send current url to Mobile', true);

key.setViewKey([',', 'm', 't'], function (ev, arg) {
    ext.exec("linker-send-text");
}, 'Linker- Send text to mobile', true);

key.setViewKey([',', 'm', 'p'], function (ev, arg) {
    ext.exec("linker-send-phone-number");
}, 'Linker- Send phone number to mobile', true);

key.setViewKey([',', ';'], function (ev, arg) {
    ext.exec('rmine-show-project-issues', arg, ev);
}, 'Redmine - Show project issues', true);

key.setViewKey([',', '+'], function (ev, arg) {
    ext.exec('rmine-show-all-issues', arg, ev);
}, 'Redmine - Show project issues', true);

key.setViewKey('.', function (ev, arg) {
    display.echoStatusBar(window.content.location.href);
}, 'URL を表示', true);

key.setEditKey('M-<left>', function (ev, arg) {
    var target = ev.originalTarget;
    if (target.tagName.toLowerCase().indexOf("textarea") == 0) {
        target.style.width = target.clientWidth - 10 + "px";
    }
}, '幅を狭める');

key.setEditKey('M-<right>', function (ev, arg) {
    var target = ev.originalTarget;
    if (target.tagName.toLowerCase().indexOf("textarea") == 0) {
        target.style.width = target.clientWidth + 10 + "px";
    }
}, '幅を広げる');

key.setEditKey('M-<up>', function (ev, arg) {
    var target = ev.originalTarget;
    if (target.tagName.toLowerCase().indexOf("textarea") == 0) {
        target.style.height = target.clientHeight - 10 + "px";
    }
}, '高さを狭める');

key.setEditKey('M-<down>', function (ev, arg) {
    var target = ev.originalTarget;
    if (target.tagName.toLowerCase().indexOf("textarea") == 0) {
        target.style.height = target.clientHeight + 10 + "px";
    }
}, '高さを広げる');

key.setEditKey('C-SPC', function (ev, arg) {
    ext.exec("japanese-input", arg, ev);
}, '日本語へ変換');

key.setEditKey('C-]', function (ev, arg) {
    ext.exec("abbreviations-expand", arg, ev);
}, '略語を挿入');

key.setEditKey('C-[', function (ev, arg) {
    ext.exec("input-html-tag", arg, ev);
}, 'HTMLタグを挿入');

key.setEditKey('C-n', function (ev, arg) {
    ext.exec("dabbrev-expand-with-suggestions", arg, ev);
}, '略語展開');

key.setEditKey('C-t', function (ev, arg) {
    ext.exec("transpose-chars", arg, ev);
}, 'Interchange characters around point', true);

key.setEditKey('C-h', function (ev, arg) {
    ext.exec('delete-backward-char', arg, ev);
}, '前の一文字を削除');

key.setEditKey('C-w', function (ev, arg) {
    ext.exec('delete-backward-word', arg, ev);
}, '前の一単語を削除');

key.setEditKey('C-m', function (ev, arg) {
    ext.exec('open-line', arg, ev);
}, '行を開く (Open line)');

key.setEditKey('C-j', function (ev, arg) {
    ext.exec('open-line', arg, ev);
}, '行を開く (Open line)');

key.setEditKey('C-r', function (ev, arg) {
    ext.exec('show-kill-ring-and-select-text-to-paste', arg, ev);
}, '選択して貼り付け');

key.setEditKey('C-u', function (ev, arg) {
    var orig = ev.originalTarget || ev.target;
    if (orig.selectionStart == orig.selectionEnd) {
        ext.exec('set-the-mark', arg, ev);
        ext.exec('beginning-of-the-line', arg, ev);
    }
    ext.exec('delete-forward-char', arg, ev);
}, '全削除');

key.setCaretKey('v', function (ev, arg) {
    ext.exec('set-the-mark', arg, ev);
}, 'マークをセット');

key.setCaretKey('i', function (ev, arg) {
    util.setBoolPref("accessibility.browsewithcaret", !util.getBoolPref("accessibility.browsewithcaret"));
}, 'Toggle Caret Mode');

key.setCaretKey('j', function (ev, arg) {
    ext.exec('move-caret-to-the-next-line', arg, ev);
}, 'キャレットを一行下へ');

key.setCaretKey('k', function (ev, arg) {
    ext.exec('move-caret-to-the-previous-line', arg, ev);
}, 'キャレットを一行上へ');

key.setCaretKey('C-f', function (ev, arg) {
    ext.exec('move-caret-down-by-page', arg, ev);
}, 'キャレットを一画面分下へ');

key.setCaretKey('C-b', function (ev, arg) {
    ext.exec('move-caret-up-by-page', arg, ev);
}, 'キャレットを一画面分上へ');

key.setCaretKey('l', function (ev, arg) {
    ext.exec('move-caret-to-the-right', arg, ev);
}, 'キャレットを一文字右へ移動');

key.setCaretKey('h', function (ev, arg) {
    ext.exec('move-caret-to-the-left', arg, ev);
}, 'キャレットを一文字左へ移動');

key.setCaretKey('^', function (ev, arg) {
    ext.exec('move-caret-to-the-beginning-of-the-line', arg, ev);
}, 'キャレットを行頭へ移動');

key.setCaretKey('$', function (ev, arg) {
    ext.exec('move-caret-to-the-end-of-the-line', arg, ev);
}, 'キャレットを行末へ移動');

key.setCaretKey('w', function (ev, arg) {
    ext.exec('move-caret-to-the-right-by-word', arg, ev);
}, 'キャレットを一単語右へ移動');

key.setCaretKey('b', function (ev, arg) {
    ext.exec('move-caret-to-theleft-by-word', arg, ev);
}, 'キャレットを一単語左へ移動');

key.setCaretKey('s', function (ev, arg) {
    ext.exec("swap-caret", arg, ev);
}, 'キャレットを交換', true);

key.setCaretKey('y', function (ev) {
    ext.exec('copy-selected-text', arg, ev);
}, '選択中のテキストをコピー');

key.setCaretKey([',', 'r'], function (ev, arg) {
    ext.exec("kungfloo-reblog-dwim", arg, ev);
}, 'Kungfloo - Reblog', true);

key.setCaretKey([',', 'e'], function (ev, arg) {
    let selected = (document.commandDispatcher.focusedWindow || gBrowser.contentWindow).getSelection().toString();
    if (selected.length > 0)
        window.evernote_doAction(document.popupNode, 'CLIP_ACTION_SELECTION');
    else
        window.evernote_doAction(document.popupNode, 'CLIP_ACTION_FULL_PAGE');
}, 'Evernote Clip', true);

key.setCaretKey('z', function (ev, arg) {
    (document.commandDispatcher.focusedWindow || gBrowser.contentWindow).getSelection().QueryInterface(Ci.nsISelection2).scrollIntoView(Ci.nsISelectionController.SELECTION_ANCHOR_REGION, true, 50, 50);
}, 'キャレット位置を画面中央に', true);

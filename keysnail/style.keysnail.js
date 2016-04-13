style.register('\
    /* 選択中行のスタイル */\
    #keysnail-completion-list listitem[selected="true"], #keysnail-completion-list:focus>listitem[selected="true"] {\
        background-color : #BFCEFA !important;\
    }\
    /* IME */\
    #keysnail-prompt-textbox *|input {\
        ime-mode : inactive !important;\
    }\
    /* タブ一覧ボタンを非表示に */\
    #alltabs-button {\
        display: none !important;\
    }\
    /* タブの閉じるボタンを非表示に */\
    toolbarbutton.tab-close-button{\
        display: none !important;\
    }\
');

style.register('\
    hr.autopagerize_page_separator {\
        display:none;\
    }\
    p.autopagerize_page_info {\
        text-align: right;\
        font-size: 10pt;\
    }\
', style.XHTML);

style.register("\
    #refcontrol-status-panel,\
    #htmlruby-entities,\
    #status-bar-panel-FiddlerHook\
    {\
        visibility: collapse !important;\
    }\
", [style.XHTML, style.XUL].join(""), true);

var addonBar = document.getElementById('addon-bar');
var navBar = document.getElementById('nav-bar');
if (navBar && addonBar) {
    navBar.insertBefore(addonBar, document.getElementById('PanelUI-button'));
}
style.register('\
    #RIL_toolbar_button {\
        display: none !important;\
    }\
    #nav-bar .toolbarbutton-1:not([type=menu-button]),\
    #nav-bar .toolbarbutton-1 > .toolbarbutton-menubutton-button,\
    #nav-bar .toolbarbutton-1 > .toolbarbutton-menubutton-dropmarker {\
        padding: 0 !important;\
    }\
    #back-button {\
        margin: 1px !important;\
    }\
    #nav-bar {\
        padding: 2px !important;\
    }\
    #status-bar {\
        -moz-appearance: none !important;\
        background-color: transparent !important;\
        border: none !important;\
    }\
    statusbarpanel {\
        -moz-appearance: none !important;\
        border: none !important;\
    }\
    #browser-bottombox {\
        border-top: rgb(160, 160, 160) 1px solid !important;\
    }\
');


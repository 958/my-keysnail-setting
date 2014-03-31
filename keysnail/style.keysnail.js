/*
let (button = document.getElementById("appmenu-button")) {
    if (button)
        button.label = 'KeySnail';
}
style.register(<><![CDATA[
    #appmenu-button {
        background-image: -moz-linear-gradient(rgb(155, 51, 115), rgb(115, 11, 75) 95%) !important;
        border-color: rgba(95, 0, 55, 0.9) !important;
    }
    #appmenu-button:hover:not(:active):not([open]) {
        box-shadow: 0pt 1px 0pt rgba(255, 255, 255, 0.1) inset, 0pt 0pt 2px 1px rgba(205, 101, 165, 0.7) inset, 0pt -1px 0pt rgba(205, 101, 165, 0.5) inset !important;
    }
}}></>);
*/
style.register('\
    /* 選択中行のスタイル */\
    #keysnail-completion-list listitem[selected="true"], #keysnail-completion-list:focus>listitem[selected="true"] {\
        background-color : #BFCEFA !important;\
    }\
    /* IME */\
    #keysnail-prompt-textbox *|input {\
        ime-mode : inactive !important;\
    }\
    /* urlbar の高さを調整 */\
    #urlbar {\
        /*margin: 0 !important;*/\
        /*border: none !important;*/\
    }\
    #urlbar>toolbarbutton, #urlbar dropmarker {\
        display: none !important;\
    }\
    .urlbar-icon {\
        /*padding:0 !important;*/\
    }\
    #addon-bar{\
        height: 26px !important;\
    }\
    /* アドオンバーの閉じるボタンを非表示に */\
    #addonbar-closebutton {\
        display: none !important;\
    }\
    /* タブの閉じるボタンを非表示に */\
    toolbarbutton.tab-close-button{\
        display: none !important;\
    }\
    /* Vertical Tabs */\
    .tabbrowser-tab{\
        min-width:16px !important;\
    }\
    /*\
    #verticaltabs-splitter{\
        margin-bottom:0px !important;\
    }\
    */\
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


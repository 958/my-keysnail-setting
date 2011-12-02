
style.register(<><![CDATA[
    /* 選択中行のスタイル */
    #keysnail-completion-list listitem[selected="true"], #keysnail-completion-list:focus>listitem[selected="true"] {
        background-color : #BFCEFA !important;
    }
    /* IME */
    #keysnail-prompt-textbox *|input {
        ime-mode : inactive !important;
    }
    /* プロンプトとアドオンバーの表示をトグルする為の仕込 */
    /*
    #ks-bottom-separator {
        border-top-width: 2px !important;
        border-top-style: solid !important;
        border-top-color: -moz-use-text-color !important;
        -moz-border-top-colors: threedshadow threedhighlight !important;
    }
    */
    #addon-bar {
        /*border-bottom: none !important;*/
        -moz-appearance: none !important;
    }
    /* urlbar の高さを調整 */
    #urlbar {
        margin: 0 !important;
        border: none !important;
    }
    #urlbar>toolbarbutton, #urlbar dropmarker {
        display: none !important;
    }
    /* アドオンバーの閉じるボタンを非表示に */
    #addonbar-closebutton {
        display: none !important;
    }
]]></>);

// プロンプト表示時はアドオンバーを非表示にする
/*
if (!my.modifyAddonBar) {
    my.modifyAddonBar = true;
    let textbox = document.getElementById('keysnail-prompt-textbox');
    if (textbox) {
        let addonBar = document.getElementById('addon-bar');

        let sep = document.createElement('hbox');
        sep.id = 'ks-bottom-separator';
        addonBar.parentNode.insertBefore(sep, addonBar);

        textbox.addEventListener('focus', function(ev) {
            addonBar.hidden = true;
        }, false);
        textbox.addEventListener('blur', function(ev) {
            addonBar.hidden = false;
        }, false);
    }
}
*/
/*
(function () {
    let addonBar = document.getElementById('addon-bar');
    let bottomBox = document.getElementById('browser-bottombox');
    bottomBox.appendChild(addonBar);
})();
*/


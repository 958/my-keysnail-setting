
// �Z�k URL �� goo.gl ��
hook.addToHook('PluginLoaded', function() {
    if (!plugins.twitterClient) return;

    plugins.twitterClient.tweetWithTitleAndURL = function(ev, arg)
        plugins.lib.shortenURL(content.location.href, function(url)
            plugins.twitterClient.tweet((arg ? "" : '"' + content.document.title + '" - ') + url)
        );

    // function �𒼐ړn���Ă���� �G�N�X�e���ēo�^����K�v������
    ext.add("twitter-client-tweet-this-page", plugins.twitterClient.tweetWithTitleAndURL,
            M({ja: '���̃y�[�W�̃^�C�g���� URL ���g���ĂԂ₭',
               en: "Tweet with the title and URL of this page"}));
});

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

    if ('allTabs' in window && allTabs.isOpen)
        allTabs.close();

    if (aEvent.target !== document.getElementById("keysnail-prompt-textbox"))
       try{ prompt.finish(true); }catch(e){}

    if (KeySnail.windowType != "navigator:browser")
        window.close();

    if (util.isCaretEnabled()) {
        if (command.marked(aEvent))
            command.resetMark(aEvent);
        util.setBoolPref("accessibility.browsewithcaret", false);
    }else
        goDoCommand("cmd_selectNone");

    if (KeySnail.windowType === "navigator:browser")
        key.generateKey(aEvent.originalTarget, KeyEvent.DOM_VK_ESCAPE, true);

    if ("blur" in aEvent.target) aEvent.target.blur();
    if (typeof gBrowser != 'undefined')
        gBrowser.focus();
    if (content)
        content.focus();
});

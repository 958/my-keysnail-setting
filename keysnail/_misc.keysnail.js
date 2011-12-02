
// default keymap
util.extendDefaultKeymap = function(keymap) {
    let defaultKeymap = {
        "C-z"   : "prompt-toggle-edit-mode",
        "SPC"   : "prompt-next-page",
        "b"     : "prompt-previous-page",
        "j"     : "prompt-next-completion",
        "k"     : "prompt-previous-completion",
        "g"     : "prompt-beginning-of-candidates",
        "G"     : "prompt-end-of-candidates",
        "q"     : "prompt-cancel",
    };
    let destKeyMap = {};
    for (let [key, value] in Iterator(defaultKeymap))
        destKeyMap[key] = value;
    if (keymap)
        for (let [key, value] in Iterator(keymap))
            destKeyMap[key] = value;
    return destKeyMap;
}

// Console
// via http://efcl.info/2011/0402/res2453/
util.fbug = function fbug(x) {
    var args = Array.slice(arguments);
    var windowManager = Cc['@mozilla.org/appshell/window-mediator;1']
                        .getService(Ci.nsIWindowMediator);
    var {Firebug} = windowManager.getMostRecentWindow("navigator:browser");
    if (Firebug.Console.isEnabled() && Firebug.toggleBar(true, 'console')) {
        Firebug.Console.logFormatted(args);
    }
    return args.length > 1 ? args : args[0];
}

// via http://d.hatena.ne.jp/mooz/20100409/p1
if (window.location.href === "chrome://venkman/content/venkman.xul") {
    ["_getChannelForURL", "loadURLNow", "loadURLAsync"].forEach(function(func) {
        if (func in window && !window[func].original) {
            let original = window[func];
            window[func] = function () {
                if (arguments[0].indexOf(" -> ") !== -1)
                    arguments[0] = arguments[0].split(" -> ")[1];
                return original.apply(this, arguments);
            };
            window[func].original = original;
        }
    });
}

// ===== plugins.lib extends =====
plugins.lib = _.extend(plugins.lib, {
    shortenURL: function (longURL, callback) {
        let url = 'https://www.googleapis.com/urlshortener/v1/url';
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let url = JSON.parse(xhr.responseText).id;
                callback(url);
            }
        };
        xhr.send(JSON.stringify({ longUrl: longURL }));
    }
});


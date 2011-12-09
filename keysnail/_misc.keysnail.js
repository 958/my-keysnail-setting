
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
/*
if (KeySnail.windowType == 'alert:alert') {
    window.innerWidth = 300;
  // Determine position
  var x = gOrigin & NS_ALERT_LEFT ? screen.availLeft :
          screen.availLeft + screen.availWidth - window.outerWidth;
  var y = gOrigin & NS_ALERT_TOP ? screen.availTop :
          screen.availTop + screen.availHeight - window.outerHeight;

  // Offset the alert by 10 pixels from the edge of the screen
  if (gOrigin & NS_ALERT_HORIZONTAL)
    y += gOrigin & NS_ALERT_TOP ? 10 : -10;
  else
    x += gOrigin & NS_ALERT_LEFT ? 10 : -10;
  window.moveTo(x, y);
//  setTimeout(function() { util.fbug(window); gFinalSize = window.innerHeight; }, 0);
  gFinalSize = document.clientHeight;

    let (elem = document.getElementById('alertTextLabel')) {
//        elem.hidden = true;
        let (desc = document.createElement('description')) {
            desc.setAttribute('style', 'overflow: visible; max-width: 200px !important;');
            desc.appendChild(document.createTextNode(elem.getAttribute('value')));
            elem.parentNode.appendChild(desc);
        }
    }
    let (elem = document.getElementById('alertBox')) {
        elem.setAttribute('style', 'max-width: 300px !important;');
        gFinalSize = elem.clientHeight;
    }
}
*/
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

/*
// タブを自動でピン留めする
plugins.options['autopin.pin_urls'] = [
    '^http://www\\.google\\.com/reader/view/',
    '^https?://mail\\.google\\.com/mail/',
    '^http://www\\.tumblr\\.com/dashboard',
    '^http://b\\.hatena\\.ne\\.jp',
];

if (typeof (gBrowser) != 'undefined') {
    // http://stackoverflow.com/questions/3374056/firefox-gbrowser-getbrowserfortab-but-no-gbrowser-gettabforbrowser
    function getTabForBrowser(aBrowser) {
        for (var i=0; i<gBrowser.browsers.length; i++) {
            if (gBrowser.getBrowserAtIndex(i) === aBrowser)
                return gBrowser.tabContainer.getItemAtIndex(i);
        }
        return null;
    }

    if (my.autoPinProgressListener)
         gBrowser.removeTabsProgressListener(my.autoPinProgressListener);

    let pinURLs = plugins.options['autopin.pin_urls'];

    my.autoPinProgressListener = {
        onLocationChange:function(aBrowser, aProgress, aRequest, aURI) {
            if (!aURI || !aURI.spec) return;

            let tab = getTabForBrowser(aBrowser);
            if (!tab.pinned) {
                let aURL = aURI.spec;
                for each (let url in pinURLs)
                    if (aURL.match(url))
                        gBrowser.pinTab(tab);
            }
        },
        onStateChange:function() { },
        onProgressChange:function() { },
        onStatusChange:function() { },
        onSecurityChange:function() { },
        onLinkIconAvailable:function() { }
    };

    gBrowser.addTabsProgressListener(my.autoPinProgressListener);
}
*/

// bartab みたいなもの
/*
if (typeof (gBrowser) != 'undefined') {
    // http://stackoverflow.com/questions/3374056/firefox-gbrowser-getbrowserfortab-but-no-gbrowser-gettabforbrowser
    function getTabForBrowser(aBrowser) {
        for (var i=0; i<gBrowser.browsers.length; i++) {
            if (gBrowser.getBrowserAtIndex(i) === aBrowser)
                return gBrowser.tabContainer.getItemAtIndex(i);
        }
        return null;
    }

    if (my.barTabProgressListener)
         gBrowser.removeTabsProgressListener(my.barTabProgressListener);

    let SS = Cc["@mozilla.org/browser/sessionstore;1"]
        .getService(Ci.nsISessionStore);

    my.barTabProgressListener = {
        onLocationChange:function(aBrowser, aProgress, aRequest, aURI) {
            if (!aURI || !aURI.spec || /^(about|chrome)/.test(aURI.spec)) return;
            if (!aProgress.isActive) {
                 let tab = getTabForBrowser(aBrowser);
                 let state = SS.getTabState(tab);
                 tab.linkedBrowser.loadURI(null);
                 SS.setTabState(tab, state);
            }
        },
        onStateChange:function() { },
        onProgressChange:function() { },
        onStatusChange:function() { },
        onSecurityChange:function() { },
        onLinkIconAvailable:function() { }
    };

    gBrowser.addTabsProgressListener(my.barTabProgressListener);
}
*/

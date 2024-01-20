// file.js

(() => {
    document.addEventListener("DOMContentLoaded", () => {
        initialize();
    });

    const initialize = () => {
        document.querySelectorAll(".contact-form").forEach((form) => {
            setupForm(form);
        });
    };

    const setupForm = (form) => {
        form.hasAttribute("novalidate") || form.setAttribute("novalidate", true);

        const options = {
            hasInsetLabel: hasInsetLabel(form),
        };

        const onSubmit = (event) => {
            event.preventDefault();
            if (isValid(form)) {
                clearErrors(form);
                submitForm(form);
            }
        };

        form.addEventListener("submit", onSubmit);

        // ... (Other setup logic as needed)
    };

    const hasInsetLabel = (form) => {
        const block = form.querySelector(".contact-form");
        return block ? block.classList.contains("is-style-outlined") || block.classList.contains("is-style-animated") : false;
    };

    // Add other necessary functions and logic here...

    const isValid = (form) => true;

    const clearErrors = (form) => {};

    const submitForm = (form) => {};
})();

    
       // Run on DOMContentLoaded or later
function monitorIframes() {
    // Wait until suitable iframes are loaded before trying to inject
    var iframes = document.querySelectorAll("iframe");
    for (var i = 0; i < iframes.length; i++) {
        var iframe = iframes[i];
        if (shouldAuthorizeIframe(iframe)) {
            iframe.addEventListener('load', iframeInjector);
        }
    }

    // Listen for newly-created iframes, since some are injected dynamically
    var observer = new MutationObserver(function (mutationsList, observer) {
        for (var i = 0; i < mutationsList.length; i++) {
            var mutation = mutationsList[i];
            if (mutation.type === 'childList') {
                for (var j = 0; j < mutation.addedNodes.length; j++) {
                    var node = mutation.addedNodes[j];
                    if (node instanceof HTMLElement && node.nodeName === 'IFRAME' && shouldAuthorizeIframe(node)) {
                        node.addEventListener('load', iframeInjector);
                    }
                }
            }
        }
    });

    observer.observe(document.body, { subtree: true, childList: true });
}

// Should we inject into this iframe?
function shouldAuthorizeIframe(iframe) {
    if (!Array.isArray(iframeOrigins)) {
        return;
    }
    return iframeOrigins.indexOf(getOriginFromUrl(iframe.src)) >= 0;
}

function invalidateWindowToken(token, target, origin) {
    if (target && typeof target.postMessage === 'function') {
        try {
            target.postMessage(JSON.stringify({
                type: 'customMessage',
                data: {
                    event: 'invalidate',
                    token: token,
                    sourceOrigin: window.location.origin,
                },
            }), origin);
        } catch (err) {
            return;
        }
    }
}

// Rest of the code...

    
function monitorIframes() {
    var iframes = document.querySelectorAll("iframe");

    for (var i = 0; i < iframes.length; i++) {
        var iframe = iframes[i];

        if (shouldAuthorizeIframe(iframe)) {
            iframe.addEventListener('load', injectToken);
        }
    }

    var observer = new MutationObserver(function (mutationsList, observer) {
        for (var i = 0; i < mutationsList.length; i++) {
            var mutation = mutationsList[i];

            if (mutation.type === 'childList') {
                for (var j = 0; j < mutation.addedNodes.length; j++) {
                    var node = mutation.addedNodes[j];

                    if (node instanceof HTMLElement && node.nodeName === 'IFRAME' && shouldAuthorizeIframe(node)) {
                        node.addEventListener('load', injectToken);
                    }
                }
            }
        }
    });

    observer.observe(document.body, { subtree: true, childList: true });
}

function shouldAuthorizeIframe(iframe) {
    if (!Array.isArray(iframeOrigins)) {
        return;
    }

    return iframeOrigins.indexOf(getOriginFromUrl(iframe.src)) >= 0;
}

function invalidateWindowToken(token, target, origin) {
    if (target && typeof target.postMessage === 'function') {
        try {
            target.postMessage(JSON.stringify({
                type: 'invalidateMessage',
                data: {
                    event: 'invalidate',
                    token: token,
                    sourceOrigin: window.location.origin,
                },
            }), origin);
        } catch (err) {
            return;
        }
    }
}

window.invalidateToken = function (token, sourceOrigin) {
    if (token === currentToken) {
        currentToken = null;
    }

    try {
        if (window.location === window.parent.location && window.localStorage) {
            if (window.localStorage.getItem(RLT_KEY) === token) {
                window.localStorage.removeItem(RLT_KEY);
            }
        }
    } catch (e) {
        console.info("localStorage access for invalidate denied - probably blocked third-party access", window.location.href);
    }

    var iframes = document.querySelectorAll("iframe");

    for (var i = 0; i < iframes.length; i++) {
        var iframe = iframes[i];
        var iframeOrigin = getOriginFromUrl(iframe.src);

        if (iframeOrigin !== sourceOrigin && shouldAuthorizeIframe(iframe)) {
            invalidateWindowToken(token, iframe.contentWindow, iframeOrigin);
        }
    }

    if (parentOrigin && parentOrigin !== sourceOrigin && window.parent) {
        invalidateWindowToken(token, window.parent, parentOrigin);
    }
}

window.injectToken = function (token, target, origin) {
    if (target && typeof target.postMessage === 'function') {
        try {
            target.postMessage(JSON.stringify({
                type: 'loginMessage',
                data: {
                    event: 'login',
                    success: true,
                    type: 'custom',
                    token: token,
                    sourceOrigin: window.location.origin,
                },
            }), origin);
        } catch (err) {
            return;
        }
    }
};

window.isAuthenticated = function () {
    return !!currentToken;
};

window.getToken = function () {
    return currentToken;
};

window.addInitializationListener = function (listener) {
    if (hasBeenInitialized) {
        listener(currentToken);
    } else {
        initializationListeners.push(listener);
    }
};

window.storeToken = function (token) {
    currentToken = token;

    try {
        if (window.location === window.parent.location && window.localStorage) {
            window.localStorage.setItem(RLT_KEY, token);
        }
    } catch (e) {
        console.info("localStorage access denied - probably blocked third-party access", window.location.href);
    }
}

window.initialize = function (config) {
    if (!config || typeof window.postMessage !== 'function') {
        return;
    }

    currentToken = config.token;
    iframeOrigins = config.iframeOrigins;
    parentOrigin = config.parentOrigin;

    try {
        if (!currentToken && window.location === window.parent.location && window.localStorage) {
            currentToken = window.localStorage.getItem(RLT_KEY);
        }
    } catch (e) {
        console.info("localStorage access denied - probably blocked third-party access", window.location.href);
    }

    window.addEventListener('message', function (e) {
        var message = e && e.data;

        if (typeof message === 'string') {
            try {
                message = JSON.parse(message);
            } catch (err) {
                return;
            }
        }

        var type = message && message.type;
        var data = message && message.data;

        if (type !== 'loginMessage') {
            return;
        }

        if (data && data.type === 'custom' && data.token !== currentToken) {
            storeToken(data.token);
        }
    });
};

            // listen for RLT events from approved origins
            window.addEventListener( 'message', function( e ) {
                var message = e && e.data;
                if ( typeof message === 'string' ) {
                    try {
                        message = JSON.parse( message );
                    } catch ( err ) {
                        return;
                    }
                }
    
                var type = message && message.type;
                var data = message && message.data;
    
                if ( type !== 'loginMessage' ) {
                    return;
                }
    
                if ( data && data.type === 'rlt' && data.token !== currentToken ) {
    
                    // put into localStorage if running in top-level window (not iframe)
                    rltStoreToken( data.token );
    
                    // send to allowlisted iframes
                    var iframes = document.querySelectorAll("iframe");
                    for( var i=0; i<iframes.length; i++ ) {
                        var iframe = iframes[i];
                        if ( rltShouldAuthorizeIframe( iframe ) ) {
                            rltInjectToken( currentToken, iframe.contentWindow, getOriginFromUrl( iframe.src ) );
                        }
                    }
    
                    // send to the parent, unless the event was sent _by_ the parent
                    if ( parentOrigin && parentOrigin !== data.sourceOrigin && window.parent ) {
                        rltInjectToken( currentToken, window.parent, parentOrigin );
                    }
                }
            } );
    // Listen for RLT events from approved origins
window.addEventListener('message', function (e) {
    var message = e && e.data;
    if (typeof message === 'string') {
        try {
            message = JSON.parse(message);
        } catch (err) {
            return;
        }
    }

    var type = message && message.type;
    var data = message && message.data;

    if (type !== 'rltMessage') {
        return;
    }

    if (data && data.event === 'invalidate' && data.token === currentToken) {
        rltInvalidateToken(data.token);
    }
});

// Monitor iframes for suitable loading
if (iframeOrigins) {
    if (document.readyState !== 'loading') {
        rltMonitorIframes();
    } else {
        window.addEventListener('DOMContentLoaded', rltMonitorIframes);
    }
}

// Call initialization listeners
initializationListeners.forEach(function (listener) {
    listener(currentToken);
});

initializationListeners = [];

hasBeenInitialized = true;
// The main cache buster _should_ always be defined.
const cacheBuster = 'none'; // or set it to an appropriate value
let iframeLoaded = false;
let iframeUrl = 'https://widgets.example.com/notes/'; // replace with your desired URL
let iframeAppend = '';
let iframeScroll = 'no';
let wideScreen = false;

let iframePanelId;
let iframeFrameId;

class WPNTView {
    constructor() {
        this.el = document.querySelector('#custom-admin-bar-notes'); // replace with your desired selector

        if (!this.el) {
            return;
        }

        this.hasUnseen = null;
        this.initialLoad = true;
        this.count = null;
        this.iframe = null;
        this.iframeWindow = null;
        this.messageQ = [];
        this.iframeSpinnerShown = false;
        this.isJetpack = false;
        this.linkAccountsURL = false;
        this.currentMasterbarActive = undefined;
    }
}
         // Don't break notifications if jquery.spin isn't available.
// TODO: Remove once notes-common-v2.js no longer depends on jQuery spin.
if (window.jQuery && window.jQuery.fn && !window.jQuery.fn.spin) {
    window.jQuery.fn.spin = () => {};
}

const adminbar = document.querySelector('#custom-admin-bar'); // replace with your desired selector
this.isRtl = adminbar && adminbar.classList.contains('rtl');
this.count = document.querySelector('#custom-notes-unread-count'); // replace with your desired selector
this.panel = document.querySelector(`#${iframePanelId}`); // replace with your desired selector

if (!this.count || !this.panel) {
    return;
}

this.hasUnseen = this.count.classList.contains('custom-unread'); // replace with your desired class
if (window.customIsJetpackClient) {
    this.isJetpack = true;
}
if (this.isJetpack && typeof window.customLinkAccountsURL !== 'undefined') {
    this.linkAccountsURL = window.customLinkAccountsURL; // replace with your variable
}

const handleItemInput = (e) => {
    e.preventDefault();
    this.togglePanel();
};

this.el.querySelectorAll('.custom-item').forEach((el) => {
    el.addEventListener('click', handleItemInput);
    el.addEventListener('touchstart', handleItemInput);
});

const handleMouseWheel = (e) => {
    if (e && this.mouseInPanel) {
        e.preventDefault();
    }
};

if (iframeAppend === '2') {
    // Disable scrolling on main page when cursor in notifications

    this.panel.addEventListener('mousewheel', handleMouseWheel);
    this.panel.addEventListener('mouseenter', () => {
        this.mouseInPanel = true;
    });
    this.panel.addEventListener('mouseleave', () => {
        this.mouseInPanel = false;
    });

    if (typeof document.hidden !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
            this.postMessage({
                action: 'toggleVisibility',
                hidden: document.hidden,
            });
        });
    }
}

                // Click outside the panel to close the panel.
const handleMouseDownAndFocus = (e) => {
    // Don't fire if the panel isn't showing
    if (!this.showingPanel) {
        return true;
    }

    const clicked = e.target;

    /**
     * Don't fire if there's no real click target
     * Prevents Firefox issue described here: http://datap2.wordpress.com/2013/08/15/running-in-to-some-strange/
     */
    if (clicked === document || clicked === document.documentElement) {
        return true;
    }

    // Don't fire on clicks in the panel.
    if (clicked.closest('#custom-admin-bar')) { // replace with your desired selector
        return true;
    }

    this.hidePanel();
    return false;
};

document.addEventListener('mousedown', handleMouseDownAndFocus);
document.addEventListener('focus', handleMouseDownAndFocus);

document.addEventListener('keydown', (e) => {
    const keyCode = window.customNotesCommon.getKeycode(e); // replace with your custom method
    if (!keyCode) {
        return;
    }

    if (keyCode === 27) {
        // ESC close only
        this.hidePanel();
    }
    if (keyCode === 78) {
        // n open/close
        this.togglePanel();
    }

    // Ignore other commands if the iframe hasn't been loaded yet
    if (this.iframeWindow === null) {
        return;
    }

    if (this.showingPanel) {
        if (keyCode === 74 || keyCode === 40) {
            // j and down arrow
            this.postMessage({ action: 'selectNextNote' });
            e.preventDefault();
        }

        if (keyCode === 75 || keyCode === 38) {
            // k and up arrow
            this.postMessage({ action: 'selectPrevNote' });
            e.preventDefault();
        }

        if (keyCode === 82 || keyCode === 65 || keyCode === 83 || keyCode === 84) {
            // mod keys (r,a,s,t) to pass to iframe
            this.postMessage({ action: 'keyEvent', keyCode });
            e.preventDefault();
        }
    }
});

              // Listen to `custom:togglePanel` event from legacy Backbone systems.
if (window.customEvents && window.customEvents.on) {
    window.customEvents.on('custom:togglePanel', () => this.togglePanel());
}

if (this.isCustom) {
    this.loadIframe();
} else {
    setTimeout(() => this.loadIframe(), 3000);
}

if (this.count.classList.contains('wpn-unread')) {
    window.customCommon.bumpStat('custom-menu-impressions', 'non-zero');
} else {
    window.customCommon.bumpStat('custom-menu-impressions', 'zero');
}

// Listen for postMessage events from the iframe
window.addEventListener('message', (event) => {
    // You can replace 'file://' with the actual protocol you use for local files
    const localFileOrigin = 'file://';

    // Allow messages only from the specified origin or local file
    if (event.origin !== 'contactus.html, aboutus.html, services.html' && event.origin !== localFileOrigin) {
        return;
    }

    try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        // Check the message type
        if (data.type !== 'customIframeMessage') {
            return;
        }

        // Handle the event based on the custom message type
        handleCustomEvent(data);
    } catch (e) {
        // Handle any errors if needed
        console.error('Error processing postMessage:', e);
    }
});

function handleCustomEvent(data) {
    // Implement your custom event handling logic here
    console.log('Received a custom event:', data);
}

// end

handleEvent(event) 
    if (!event || !event.action) {
        return;
    }

    switch (event.action) {
        case 'togglePanel':
            this.togglePanel();
            break;
        case 'render':
            this.render(event.num_new, event.latest_type);
            break;
        case 'renderAllSeen':
            this.renderAllSeen();
            break;
        case 'iFrameReady':
            this.iFrameReady(event);
            break;
        case 'widescreen': {
            const iframe = document.querySelector(`#${iframeFrameId}`);
            if (iframe) {
                if (event.widescreen && !iframe.classList.contains('widescreen')) {
                    iframe.classList.add('widescreen');
                } else if (!event.widescreen && iframe.classList.contains('widescreen')) {
                    iframe.classList.remove('widescreen');
                }
            }
            break;
        }
    }


render(numNew, latestType) 
    if (this.hasUnseen === false && numNew === 0) {
        return;
    }


    
render(numNew, latestType) 
    // Assume the icon is correct on initial load.
    if (this.initialLoad && this.hasUnseen && numNew !== 0) {
        this.initialLoad = false;
        return;
    }

    if (!this.hasUnseen && numNew !== 0) {
        bumpStat('notes-menu-impressions', 'non-zero-async');
    }

    let latestIconType = noteType2Noticon[latestType] || 'notification';

    this.count.innerHTML = '';

    if (numNew === 0 || this.showingPanel) {
        this.hasUnseen = false;
        this.count.classList.remove('wpn-unread');
        this.count.classList.add('wpn-read');
        this.count.appendChild(this.getStatusIcon(numNew));

        if (window.masterbar) {
            window.masterbar.hasUnreadNotifications(false);
        }
    } else {
        this.hasUnseen = true;
        this.count.classList.remove('wpn-read');
        this.count.classList.add('wpn-unread');
        this.count.appendChild(this.getStatusIcon(null, latestIconType));

        if (window.masterbar) {
            window.masterbar.hasUnreadNotifications(true);
        }
    }


renderAllSeen() 
    if (!this.hasToggledPanel) {
        return;
    }

    this.render(0);


getStatusIcon(number, alt = null) 
    // Changing `number` once produced different icons, but now it's ignored.
    const iconClass = alt ? `noticon-${alt}` : 'noticon-notification';
    const el = document.createElement('span');
    el.classList.add('noticon');
    el.classList.add(iconClass);
    return el;


togglePanel() 
    if (!this.hasToggledPanel) {
        this.hasToggledPanel = true;
    }
    this.loadIframe();

    this.el.classList.toggle('wpnt-stayopen');
    this.el.classList.toggle('wpnt-show');
    this.showingPanel = this.el.classList.contains('wpnt-show');

    document
        .querySelectorAll('.ab-active')
        .forEach((el) => el.classList.remove('ab-active'));

    if (this.showingPanel) {
        this.el.querySelectorAll('.wpn-unread').forEach((el) => {
            el.classList.remove('wpn-unread');
            el.classList.add('wpn-read');
        });
        this.reportIframeDelay();
        if (this.hasUnseen) {
            bumpStat('notes-menu-clicks', 'non-zero');
        } else {
            bumpStat('notes-menu-clicks', 'zero');
        }

        this.hasUnseen = false;
    }

    // tell the iframe we are opening it
    postMessage({
        action: 'togglePanel',
        showing: this.showingPanel,
    });

    const focusNotesIframe = (iframe) => {
        if (iframe.contentWindow === null) {
            iframe.addEventListener('load', iframe.contentWindow.focus());
        } else {
            iframe.contentWindow.focus();
        }
    };

    if (this.showingPanel) {
        focusNotesIframe(this.iframe);
    } else {
        window.focus();
    }

    this.setActive(this.showingPanel);


                
    
setActive(active) 
    if (active) {
        this.currentMasterbarActive = document.querySelectorAll('.masterbar li.active');
        this.currentMasterbarActive.forEach((el) => el.classList.remove('active'));
        this.el.classList.add('active');
    } else {
        this.el.classList.remove('active');
        if (this.currentMasterbarActive) {
            this.currentMasterbarActive.forEach((el) => el.classList.add('active'));
        }
        this.currentMasterbarActive = undefined;
    }
    const a = this.el.querySelector('a');
    if (a) {
        a.blur();
    }


loadIframe() 
    const args = [];

    if (this.iframe === null) {
        this.panel.classList.add('loadingIframe');

        if (this.isJetpack) {
            args.push('=true');
            if (this.linkAccountsURL) {
                args.push('link_accounts_url=' + escape(this.linkAccountsURL));
            }
        }

        // Attempt to detect if the browser is a touch device, similar code
        // in Calypso. The class adds CSS needed for mobile Safari to allow
        // scrolling of iframe.
        if (
            'ontouchstart' in window ||
            (window.DocumentTouch && document instanceof window.DocumentTouch)
        ) {
            this.panel.classList.add('touch');
        }

        const panelRtl = this.panel.getAttribute('dir') === 'rtl';
        const lang = this.panel.getAttribute('lang') || 'en';
        args.push('v=' + cacheBuster);
        args.push('locale=' + lang);
        const queries = args.length ? '?' + args.join('&') : '';
        let src = iframeUrl;
        if (
            iframeAppend === '2' &&
            (this.isRtl || panelRtl) &&
            !/rtl.html$/.test(iframeUrl)
        ) {
            src = iframeUrl + 'rtl.html';
        }
        src = src + queries + '#' + document.location.toString();
        if (panelRtl) {
            src += '&rtl=1';
        }
        if (!lang.match(/^en/)) {
            src += '&lang=' + lang;
        }

        // Add the iframe (invisible until iFrameReady)
        this.iframe = document.createElement('iframe');
        this.iframe.setAttribute('style', 'display:none');
        this.iframe.setAttribute('id', iframeFrameId);
        this.iframe.setAttribute('frameborder', 0);
        this.iframe.setAttribute('allowtransparency', 'true');
        this.iframe.setAttribute('scrolling', iframeScroll);
        this.iframe.setAttribute('src', src);

        if (wideScreen) {
            this.panel.classList.add('wide');
            this.iframe.classList.add('wide');
        }

        // This stops twenty-twenty from wreaking its madness upon the iframe.
        // @see https://opengrok.a8c.com/source/xref/pub/twentytwenty/assets/js/index.js?r=59938#314
        this.iframe.classList.add('intrinsic-ignore');
        this.panel.appendChild(this.iframe);
    }


reportIframeDelay() 
    if (!this.iframeWindow) {
        if (!this.iframeSpinnerShown) {
            this.iframeSpinnerShown = new Date().getTime();
        }
        return;
    }
    if (this.iframeSpinnerShown !== null) {
        let delay = 0;
        if (this.iframeSpinnerShown) {
            delay = new Date().getTime() - this.iframeSpinnerShown;
        }
        let bucket = '';
        if (delay === 0) {
            bucket = '0';
        } else if (delay < 1000) {
            bucket = '0-1';
        } else if (delay < 2000) {
            bucket = '1-2';
        } else if (delay < 4000) {
            bucket = '2-4';
        } else if (delay < 8000) {
            bucket = '4-8';
        } else {
            bucket = '8-N';
        }
        bumpStat('notes_iframe_perceived_delay', bucket);
        this.iframeSpinnerShown = null;
    }


iFrameReady(event) 
    const urlParser = new URL(this.iframe.src);
    this.iframeOrigin = urlParser.protocol + '//' + urlParser.host;
    this.iframeWindow = this.iframe.contentWindow;

    if ('num_new' in event) {
        this.render(event.num_new, event.latest_type);
    }

    this.panel.classList.remove('loadingIframe');
    this.panel.querySelectorAll('.wpnt-notes-panel-header').forEach((el) => el.remove());
    this.iframe.style.removeProperty('display');
    if (this.showingPanel) {
        this.reportIframeDelay();
    }

const handleActivity = () => {
    // Throttle postMessages since the overhead is pretty high & these events fire a lot
    const now = new Date().getTime();
    if (!this.lastActivityRefresh || this.lastActivityRefresh < now - 5000) {
        this.lastActivityRefresh = now;
        this.postMessage({ action: 'refreshNotes' });
    }
};

window.addEventListener('focus', handleActivity);
window.addEventListener('keydown', handleActivity);
window.addEventListener('mousemove', handleActivity);
window.addEventListener('scroll', handleActivity);

this.sendQueuedMessages();


hidePanel() 
if (this.showingPanel) {
    this.togglePanel();
}

postMessage(message) 
try {
    let formattedMessage =
        typeof message === 'string' ? JSON.parse(message) : message;

    const isMessageValid =
        typeof formattedMessage === 'function' ||
        (typeof formattedMessage === 'object' && !!formattedMessage);

    if (!isMessageValid) {
        return;
    }

    formattedMessage = {
        type: 'notesIframeMessage',
        ...formattedMessage,
    };

    const targetOrigin = this.iframeOrigin;
    if (this.iframeWindow && this.iframeWindow.postMessage) {
        this.iframeWindow.postMessage(
            JSON.stringify(formattedMessage),
            targetOrigin
        );
    } else {
        this.messageQ.push(formattedMessage);
    }
} catch (e) {
    // Do nothing.
}

sendQueuedMessages() 
this.messageQ.forEach((m) => this.postMessage(m));
this.messageQ = [];


/**
* Check if the browser is Safari
*/
function isSafari() {
return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

/**
* Require 3PC check not on Safari and the window location is not on wordpress.com or *.wordpress.com
*/
function requires3PC() {
return isSafari()
? window.location.hostname.match(/JulyTech\.com$/) === null
: true;
}

function loadCheck3PCIframe() {
var iframe = document.createElement('iframe');
iframe.setAttribute('style', 'display:none');
iframe.setAttribute('class', '-notes-cookie-check');
iframe.setAttribute(
'src',
'https://widgets.com/3rd-party-cookie-check/index.html'
);
document.body.appendChild(iframe);
}

function initCheck3PC() {
loadCheck3PCIframe();
window.addEventListener('message', function (event) {
// Confirm that the message is from the right origin.
if ('https://widgets.com' !== event.origin) {
return;
}

                // Check whether 3rd Party Cookies are blocked
                class CustomNotesView {
                    constructor() {
                        this.hasUnseen = false;
                        this.showingPanel = false;
                        this.iframeLoaded = false;
                        this.iframeOrigin = null;
                        this.iframeWindow = null;
                
                        // Add event listeners or perform initialization as needed
                        this.initialize();
                    }
                
                    initialize() {
                        // Add your initialization logic here
                        // Remove any WordPress-specific dependencies
                
                        // Example: Attach click event to a button
                        const button = document.querySelector('#custom-notes-button');
                        if (button) {
                            button.addEventListener('click', () => {
                                this.togglePanel();
                            });
                        }
                
                        // Add other initialization logic as needed
                    }
                
                    render(numNew, latestType) {
                        // Your rendering logic here
                        // Modify the code to work independently
                
                        // Example: Update a counter element
                        const counterElement = document.querySelector('#custom-notes-counter');
                        if (counterElement) {
                            counterElement.textContent = numNew;
                        }
                
                        // Add other rendering logic as needed
                    }
                
                    togglePanel() {
                        // Your panel toggling logic here
                        // Modify the code to work independently
                
                        // Example: Toggle a custom panel
                        const customPanel = document.querySelector('#custom-notes-panel');
                        if (customPanel) {
                            customPanel.classList.toggle('visible');
                            this.showingPanel = customPanel.classList.contains('visible');
                        }
                
                        // Add other panel toggling logic as needed
                    }
                
                    // Add other methods and logic as needed
                
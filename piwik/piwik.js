const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HOST_PATTERN = /^[a-z0-9.-]+$/i;
const DATA_LAYER_PATTERN = /^[A-Za-z_$][0-9A-Za-z_$]*$/;

/**
 * Returns the addon options, overridden by a mviewer-specific block when one
 * matches the current application id.
 *
 * @returns {Object} Resolved addon options.
 */
const getComponentOptions = () => {
    const config = mviewer.customComponents.piwik.config;
    const options = config.options || {};
    const hasConfiguration = typeof configuration !== "undefined" && typeof configuration.getConfiguration === "function";
    const appConfig = hasConfiguration ? configuration.getConfiguration() : {};
    const mviewerId = appConfig.application && appConfig.application.id;

    if (mviewerId && options.mviewers && options.mviewers[mviewerId]) {
        return Object.assign({}, options, options.mviewers[mviewerId]);
    }

    return options;
};

/**
 * Logs a namespaced addon error when the browser console is available.
 *
 * @param {string} message - Error message to log.
 * @returns {void}
 */
const logError = (message) => {
    if (window.console && typeof window.console.error === "function") {
        window.console.error("[piwik addon] " + message);
    }
};

/**
 * Resolves and validates the data layer global variable name.
 *
 * @param {Object} options - Addon options.
 * @param {string} options.dataLayerName - Data layer name.
 * @returns {string} Valid data layer name, or an empty string when missing or invalid.
 */
const getDataLayerName = (options) => {
    const name = options.dataLayerName || "";

    if (!name) {
        logError("Missing dataLayerName.");
        return "";
    }

    if (!DATA_LAYER_PATTERN.test(name)) {
        logError("Invalid dataLayerName. Only JavaScript identifier names are allowed.");
        return "";
    }

    return name;
};

/**
 * Resolves and validates the remote Piwik container host.
 *
 * @param {Object} options - Addon options.
 * @param {string} options.containerHost - Host serving the Piwik container script.
 * @returns {string} Valid host, or an empty string when missing or invalid.
 */
const getContainerHost = (options) => {
    const host = options.containerHost || "";

    if (!host) {
        logError("Missing containerHost.");
        return "";
    }

    if (!HOST_PATTERN.test(host)) {
        logError("Invalid containerHost.");
        return "";
    }

    return host;
};

/**
 * Resolves and validates the Piwik container id for the current browser host.
 *
 * @param {Object} options - Addon options.
 * @param {Object.<string, string>} [options.containerIds] - Container ids indexed by host.
 * @param {Object.<string, string>} [options.hostKey] - Legacy container id mapping.
 * @param {string} [options.defaultContainerId] - Fallback container id.
 * @returns {string} Valid container id, or an empty string when missing or invalid.
 */
const getContainerId = (options) => {
    const host = window.location.hostname;
    const fullHost = window.location.host;
    const containerIds = options.containerIds || options.hostKey || {};
    const containerId = containerIds[fullHost] || containerIds[host] || options.defaultContainerId || "";

    if (!containerId) {
        logError("Missing Piwik container id for this host.");
        return "";
    }

    if (!UUID_PATTERN.test(containerId)) {
        logError("Invalid Piwik container id.");
        return "";
    }

    return containerId;
};

/**
 * Creates or expires a cookie used by the Piwik debug mode.
 *
 * @param {string} name - Cookie name.
 * @param {string} value - Cookie value.
 * @param {number} days - Number of days before expiration. Negative values expire the cookie.
 * @returns {void}
 */
function stgCreateCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * days * 60 * 60 * 1000);

    let cookie = [
        encodeURIComponent(name) + "=" + encodeURIComponent(value),
        "expires=" + expires.toUTCString(),
        "path=/",
        "SameSite=Strict"
    ];

    if (window.location.protocol === "https:") {
        cookie.push("Secure");
    }

    document.cookie = cookie.join("; ");
}

/**
 * Builds the secure Piwik container script URL from validated options.
 *
 * @param {Object} options - Addon options.
 * @param {string} dataLayerName - Validated data layer name.
 * @param {string} containerId - Validated Piwik container id.
 * @returns {string} Script URL, or an empty string when the host is invalid.
 */
const getScriptUrl = (options, dataLayerName, containerId) => {
    const containerHost = getContainerHost(options);

    if (!containerHost) {
        return "";
    }

    const url = new URL("https://" + containerHost + "/" + containerId + ".js");

    url.searchParams.set("data_layer_name", dataLayerName);

    if (options.allowDebug === true && isDebugEnabled()) {
        url.searchParams.set("stg_debug", "");
    }

    return url.toString();
};

/**
 * Checks whether debug mode was requested and not explicitly disabled.
 *
 * @returns {boolean} True when debug mode should be enabled.
 */
const isDebugEnabled = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const debugRequested = searchParams.has("stg_debug") || document.cookie.indexOf("stg_debug=1") !== -1;
    const debugDisabled = searchParams.has("stg_disable_debug");

    return debugRequested && !debugDisabled;
};

/**
 * Creates the minimal Piwik Pro API shim that queues calls in the data layer.
 *
 * @param {string} dataLayerName - Validated data layer name.
 * @returns {void}
 */
const createPiwikApi = (dataLayerName) => {
    !(function (a, n, i) {
        a[n] = a[n] || {};
        for (let c = 0; c < i.length; c++) {
            !(function (i) {
                (a[n][i] = a[n][i] || {}),
                (a[n][i].api =
                    a[n][i].api ||
                    function () {
                        const args = [].slice.call(arguments, 0);
                        if (typeof args[0] === "string") {
                            window[dataLayerName].push({
                                event: n + "." + i + ":" + args[0],
                                parameters: [].slice.call(arguments, 1),
                            });
                        }
                    });
            })(i[c]);
        }
    })(window, "ppms", ["tm", "cm"]);
};

/**
 * Initializes the data layer, injects the remote Piwik container script, and
 * registers the Piwik API shim.
 *
 * @returns {void}
 */
const create = () => {
    const options = getComponentOptions();
    const dataLayerName = getDataLayerName(options);
    const containerId = getContainerId(options);

    if (!dataLayerName || !containerId) {
        return;
    }

    window[dataLayerName] = window[dataLayerName] || [];
    window[dataLayerName].push({ start: (new Date()).getTime(), event: "stg.start" });

    const debugEnabled = options.allowDebug === true && isDebugEnabled();
    stgCreateCookie("stg_debug", debugEnabled ? "1" : "", debugEnabled ? 14 : -1);

    const scriptUrl = getScriptUrl(options, dataLayerName, containerId);

    if (!scriptUrl) {
        return;
    }

    const script = document.getElementsByTagName("script")[0];
    const tag = document.createElement("script");
    tag.async = true;
    tag.referrerPolicy = options.referrerPolicy || "strict-origin-when-cross-origin";
    tag.src = scriptUrl;

    if (script && script.parentNode) {
        script.parentNode.insertBefore(tag, script);
    } else {
        document.head.appendChild(tag);
    }

    createPiwikApi(dataLayerName);
};

/**
 * Custom component entry point.
 *
 * @returns {void}
 */
const init = () => {
    create();
};

new CustomComponent("piwik", init);

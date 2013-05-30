/**
 * @license RequireJS i19n 1.0.0 Copyright (c) 2013
 * Available via the MIT or new BSD license.
 */

/**
 * This plugin handles i19n! prefixed modules. (you know i18n but one better...) 
 *
 * A regular module can have a dependency on an i19n bundle, but the regular
 * module does not want to specify what locale to load. So it just specifies
 * the top-level bundle, like "i19n!strings".
 *
 * This plugin will load the i19n bundle at 'strings', see that it is a root/master
 * bundle since it does not have a locale in its name. It will then try to find
 * the best match locale available in that master bundle, then request all the
 * locale pieces for that best match locale. For instance, if the locale is "en-us",
 * then the plugin will ask for the "en-us", "en" and "root" bundles to be loaded
 * (but only if they are specified on the master bundle).
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the 'strings' bundle to be that mixed in locale.
 *
 * See: https://github.com/benpriebe/i19n for more details.
 */

/* Dependencies: JQuery */

(function () {
    'use strict';

    var hasProperty = Object.prototype.hasOwnProperty;

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (theItem) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === theItem) {
                    return i;
                }
            }
            return -1;
        };
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn) {
            for (var i = 0; i < this.length; i++) {
                fn(this[i]);
            }
        };
    }

    function mixin(base, shouldExtend, mixins) {
        if (arguments.length < 3)
            return base;

        var extensions = Array.prototype.isPrototypeOf(mixins) ? mixins : [mixins];

        extensions.forEach(function (extension) {
            for (var prop in extension) {
                // ignore inherited
                if (!hasProperty.call(extension, prop))
                    continue;

                // don't extend the base object if it doesn't already have this property, unless "shouldExtend" is true
                var inBase = hasProperty.call(base, prop);
                if (!(inBase || shouldExtend))
                    continue;

                var value = extension[prop];
                if (typeof value === "string") {
                    base[prop] = value;

                } else {
                    base[prop] = inBase
                        ? mixin(base[prop], shouldExtend, value)
                        : mixin({}, shouldExtend, value);
                }
            }
        });

        return base;
    };

    define(['module'], function(module) {
        var moduleConfig = module.config ? module.config() : {};

        return {
            version: '2.0.1+',

            load: function (name, req, onLoad, config) {
                if (!moduleConfig.locale) {
                    moduleConfig.locale = typeof navigator === "undefined" ? "" : (navigator.language || navigator.userLanguage || "").toLowerCase();
                }

                req([name], function (rootModule) {
                    if (moduleConfig.locale) {
                        var parts = moduleConfig.locale.split("-");
                        var currentLocale = "", part, i;
                        var supportedLocales = rootModule.supportedLocales || moduleConfig.supportedLocales || [];
                        var localesToLoad = [];

                        for (i = 0; i < parts.length; i++) {
                            part = parts[i];
                            currentLocale += (currentLocale ? "-" : "") + part;
                            if (supportedLocales.indexOf(currentLocale) > -1)
                                localesToLoad.push(name + "." + currentLocale);
                        }

                        req(localesToLoad, function() {
                            // clone root
                            var clone = mixin({}, true, rootModule.root);

                            // mixin locales
                            var mixed = mixin(clone, false, Array.prototype.slice.call(arguments, 0));

                            onLoad(mixed);
                        });

                    } else {
                        onLoad(rootModule.root);
                    }
                });
            }
        };
    });
})();


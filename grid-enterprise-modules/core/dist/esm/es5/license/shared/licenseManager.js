var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { MD5 } from './md5';
// move to general utils
function missingOrEmpty(value) {
    return value == null || value.length === 0;
}
function exists(value, allowEmptyString) {
    if (allowEmptyString === void 0) { allowEmptyString = false; }
    return value != null && (value !== '' || allowEmptyString);
}
var LICENSE_TYPES = {
    '01': 'GRID',
    '02': 'CHARTS',
    '0102': 'BOTH'
};
var LicenseManager = /** @class */ (function () {
    function LicenseManager(document) {
        this.watermarkMessage = undefined;
        this.document = document;
        this.md5 = new MD5();
        this.md5.init();
    }
    LicenseManager.prototype.validateLicense = function () {
        var licenseDetails = this.getLicenseDetails(LicenseManager.licenseKey);
        if (licenseDetails.missing) {
            if (!this.isWebsiteUrl() || this.isForceWatermark()) {
                this.outputMissingLicenseKey();
            }
        }
        else if (!licenseDetails.valid) {
            this.outputInvalidLicenseKey(licenseDetails.incorrectLicenseType, licenseDetails.licenseType);
        }
        else if (licenseDetails.isTrial && licenseDetails.trialExpired) {
            this.outputExpiredTrialKey(licenseDetails.expiry);
        }
        else if (licenseDetails.expired) {
            var gridReleaseDate = LicenseManager.getGridReleaseDate();
            var formattedReleaseDate = LicenseManager.formatDate(gridReleaseDate);
            this.outputIncompatibleVersion(licenseDetails.expiry, formattedReleaseDate);
        }
    };
    LicenseManager.extractExpiry = function (license) {
        var restrictionHashed = license.substring(license.lastIndexOf('_') + 1, license.length);
        return new Date(parseInt(LicenseManager.decode(restrictionHashed), 10));
    };
    LicenseManager.extractLicenseComponents = function (licenseKey) {
        // when users copy the license key from a PDF extra zero width characters are sometimes copied too
        // carriage returns and line feeds are problematic too
        // all of which causes license key validation to fail - strip these out
        var cleanedLicenseKey = licenseKey.replace(/[\u200B-\u200D\uFEFF]/g, '');
        cleanedLicenseKey = cleanedLicenseKey.replace(/\r?\n|\r/g, '');
        // the hash that follows the key is 32 chars long
        if (licenseKey.length <= 32) {
            return { md5: null, license: licenseKey, version: null, isTrial: null };
        }
        var hashStart = cleanedLicenseKey.length - 32;
        var md5 = cleanedLicenseKey.substring(hashStart);
        var license = cleanedLicenseKey.substring(0, hashStart);
        var _a = __read(LicenseManager.extractBracketedInformation(cleanedLicenseKey), 3), version = _a[0], isTrial = _a[1], type = _a[2];
        return { md5: md5, license: license, version: version, isTrial: isTrial, type: type };
    };
    LicenseManager.prototype.getLicenseDetails = function (licenseKey) {
        if (missingOrEmpty(licenseKey)) {
            return {
                licenseKey: licenseKey,
                valid: false,
                missing: true
            };
        }
        var gridReleaseDate = LicenseManager.getGridReleaseDate();
        var _a = LicenseManager.extractLicenseComponents(licenseKey), md5 = _a.md5, license = _a.license, version = _a.version, isTrial = _a.isTrial, type = _a.type;
        var valid = (md5 === this.md5.md5(license)) && licenseKey.indexOf("For_Trialing_ag-Grid_Only") === -1;
        var trialExpired = undefined;
        var expired = undefined;
        var expiry = null;
        var incorrectLicenseType = undefined;
        var licenseType = undefined;
        function handleTrial() {
            var now = new Date();
            trialExpired = (expiry < now);
            expired = undefined;
        }
        if (valid) {
            expiry = LicenseManager.extractExpiry(license);
            valid = !isNaN(expiry.getTime());
            if (valid) {
                expired = (gridReleaseDate > expiry);
                switch (version) {
                    case "legacy":
                    case "2": {
                        if (isTrial) {
                            handleTrial();
                        }
                        break;
                    }
                    case "3": {
                        if (missingOrEmpty(type)) {
                            valid = false;
                        }
                        else {
                            if (type !== LICENSE_TYPES['01'] && type !== LICENSE_TYPES['0102']) {
                                valid = false;
                                incorrectLicenseType = true;
                                licenseType = type;
                            }
                            else if (isTrial) {
                                handleTrial();
                            }
                        }
                    }
                }
            }
        }
        if (!valid) {
            return {
                licenseKey: licenseKey,
                valid: valid,
                incorrectLicenseType: incorrectLicenseType,
                licenseType: licenseType
            };
        }
        return {
            licenseKey: licenseKey,
            valid: valid,
            expiry: LicenseManager.formatDate(expiry),
            expired: expired,
            version: version,
            isTrial: isTrial,
            trialExpired: trialExpired
        };
    };
    LicenseManager.prototype.isDisplayWatermark = function () {
        return this.isForceWatermark() || (!this.isLocalhost() && !this.isWebsiteUrl() && !missingOrEmpty(this.watermarkMessage));
    };
    LicenseManager.prototype.getWatermarkMessage = function () {
        return this.watermarkMessage || '';
    };
    LicenseManager.prototype.getHostname = function () {
        var win = (this.document.defaultView || window);
        var loc = win.location;
        var _a = loc.hostname, hostname = _a === void 0 ? '' : _a;
        return hostname;
    };
    LicenseManager.prototype.isForceWatermark = function () {
        var win = (this.document.defaultView || window);
        var loc = win.location;
        var pathname = loc.pathname;
        return pathname ? pathname.indexOf('forceWatermark') !== -1 : false;
    };
    LicenseManager.prototype.isWebsiteUrl = function () {
        var hostname = this.getHostname();
        return hostname.match(/^((?:\w+\.)?ag-grid\.com)$/) !== null;
    };
    LicenseManager.prototype.isLocalhost = function () {
        var hostname = this.getHostname();
        return hostname.match(/^(?:127\.0\.0\.1|localhost)$/) !== null;
    };
    LicenseManager.formatDate = function (date) {
        var monthNames = [
            'January', 'February', 'March',
            'April', 'May', 'June', 'July',
            'August', 'September', 'October',
            'November', 'December'
        ];
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    };
    LicenseManager.getGridReleaseDate = function () {
        return new Date(parseInt(LicenseManager.decode(LicenseManager.RELEASE_INFORMATION), 10));
    };
    LicenseManager.decode = function (input) {
        var keystr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var t = '';
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        var e = input.replace(/[^A-Za-z0-9+/=]/g, '');
        while (f < e.length) {
            s = keystr.indexOf(e.charAt(f++));
            o = keystr.indexOf(e.charAt(f++));
            u = keystr.indexOf(e.charAt(f++));
            a = keystr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r);
            }
            if (a != 64) {
                t = t + String.fromCharCode(i);
            }
        }
        t = LicenseManager.utf8_decode(t);
        return t;
    };
    LicenseManager.utf8_decode = function (input) {
        input = input.replace(/rn/g, 'n');
        var t = '';
        for (var n = 0; n < input.length; n++) {
            var r = input.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
            }
            else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128);
            }
            else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128);
            }
        }
        return t;
    };
    LicenseManager.setLicenseKey = function (licenseKey) {
        this.licenseKey = licenseKey;
    };
    LicenseManager.extractBracketedInformation = function (licenseKey) {
        // legacy no trial key
        if (!licenseKey.includes("[")) {
            return ["legacy", false, undefined];
        }
        var matches = licenseKey.match(/\[(.*?)\]/g).map(function (match) { return match.replace("[", "").replace("]", ""); });
        if (!matches || matches.length === 0) {
            return ["legacy", false, undefined];
        }
        var isTrial = matches.filter(function (match) { return match === 'TRIAL'; }).length === 1;
        var rawVersion = matches.filter(function (match) { return match.indexOf("v") === 0; })[0];
        var version = rawVersion ? rawVersion.replace('v', '') : 'legacy';
        var type = LICENSE_TYPES[matches.filter(function (match) { return LICENSE_TYPES[match]; })[0]];
        return [version, isTrial, type];
    };
    LicenseManager.prototype.outputInvalidLicenseKey = function (incorrectLicenseType, licenseType) {
        console.error('*****************************************************************************************************************');
        console.error('***************************************** AG Grid Enterprise License ********************************************');
        console.error('********************************************* Invalid License ***************************************************');
        if (exists(incorrectLicenseType) && incorrectLicenseType && licenseType === 'CHARTS') {
            console.error('* The license supplied is for AG Charts Enterprise Only and does not cover AG Grid Enterprise                   *');
        }
        console.error('* Your license for AG Grid Enterprise is not valid - please contact info@ag-grid.com to obtain a valid license. *');
        console.error('*****************************************************************************************************************');
        console.error('*****************************************************************************************************************');
        this.watermarkMessage = "Invalid License";
    };
    LicenseManager.prototype.outputExpiredTrialKey = function (formattedExpiryDate) {
        console.error('****************************************************************************************************************');
        console.error('***************************************** AG Grid Enterprise License *******************************************');
        console.error('*****************************************   Trial Period Expired.    *******************************************');
        console.error("* Your license for AG Grid Enterprise expired on ".concat(formattedExpiryDate, ".                                                *"));
        console.error('* Please email info@ag-grid.com to purchase a license.                                                         *');
        console.error('****************************************************************************************************************');
        console.error('****************************************************************************************************************');
        this.watermarkMessage = "Trial Period Expired";
    };
    LicenseManager.prototype.outputMissingLicenseKey = function () {
        console.error('****************************************************************************************************************');
        console.error('***************************************** AG Grid Enterprise License *******************************************');
        console.error('****************************************** License Key Not Found ***********************************************');
        console.error('* All AG Grid Enterprise features are unlocked.                                                                *');
        console.error('* This is an evaluation only version, it is not licensed for development projects intended for production.     *');
        console.error('* If you want to hide the watermark, please email info@ag-grid.com for a trial license.                        *');
        console.error('****************************************************************************************************************');
        console.error('****************************************************************************************************************');
        this.watermarkMessage = "For Trial Use Only";
    };
    LicenseManager.prototype.outputIncompatibleVersion = function (formattedExpiryDate, formattedReleaseDate) {
        console.error('****************************************************************************************************************************');
        console.error('****************************************************************************************************************************');
        console.error('*                                             AG Grid Enterprise License                                                   *');
        console.error('*                           License not compatible with installed version of AG Grid Enterprise.                           *');
        console.error('*                                                                                                                          *');
        console.error("* Your AG Grid License entitles you to all versions of AG Grid that we release within the time covered by your license     *");
        console.error("* - typically we provide one year licenses which entitles you to all releases / updates of AG Grid within that year.       *");
        console.error("* Your license has an end (expiry) date which stops the license key working with versions of AG Grid released after the    *");
        console.error("* license end date. The license key that you have expires on ".concat(formattedExpiryDate, ", however the version of AG Grid you    *"));
        console.error("* are trying to use was released on ".concat(formattedReleaseDate, ".                                                               *"));
        console.error('*                                                                                                                          *');
        console.error('* Please contact info@ag-grid.com to renew your subscription to new versions and get a new license key to work with this   *');
        console.error('* version of AG Grid.                                                                                                      *');
        console.error('****************************************************************************************************************************');
        console.error('****************************************************************************************************************************');
        this.watermarkMessage = "License Expired";
    };
    LicenseManager.RELEASE_INFORMATION = 'MTcwMTA2NzIwMjg3Mw==';
    return LicenseManager;
}());
export { LicenseManager };

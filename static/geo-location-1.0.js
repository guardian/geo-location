/* GeoLocation 1.0 */

/** @namespace */
guardian = guardian || {};
(function (jQuery) {

    var url = "http://localhost:8088/geo-location";

    function GeoLocation() {
    }

    GeoLocation.cached = null;

    GeoLocation.prototype.getCachedGeoCode = function () {
        if (window.sessionStorage) {
            return sessionStorage.getItem("geoLocation_countryCode");
        } else {
            return this.cached;
        }
    };

    GeoLocation.prototype.setCachedGeoCode = function (countryCode) {
        if (window.sessionStorage) {
            sessionStorage.setItem("geoLocation_countryCode", countryCode);
        } else {
            this.cached = countryCode;
        }
    };

    GeoLocation.prototype.getGeoCode = function () {

        if (this.getCachedGeoCode()) {
            return jQuery.Deferred()
                .resolve(this.getCachedGeoCode())
                .promise();
        }

        var promise = jQuery.ajax({
            url:url,
            dataType:'jsonp'
        });
        promise.then(jQuery.proxy(this.setCachedGeoCode, this));
        return promise;

    };

    GeoLocation.prototype.init = function () {

        var dataOnlyInCountry = jQuery("[data-only-in-country]");

        if (!dataOnlyInCountry.length) {
            return;
        }

        this.getGeoCode().then(function (actualCountryCode) {

            dataOnlyInCountry.each(function (i, obj) {

                var jObj = jQuery(obj),
                    expectedCountryCode = jObj.attr("data-only-in-country");

                if (expectedCountryCode.toUpperCase() !== actualCountryCode.toUpperCase()) {
                    jObj.remove();
                } else {
                    jObj.addClass("suitable")
                }

            });

        });

    };

    guardian.GeoLocation = GeoLocation;

    jQuery(function() {
        new guardian.GeoLocation().init();
    })

})(jQuery);
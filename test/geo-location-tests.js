(function () {

    module("Geo Location", {
        setup:function () {
            sinon.stub(jQuery, "ajax");
            jQuery.ajax.returns({
                then:function (fn) {
                    fn(userCountryCode);
                }
            });
            geoLocation = new guardian.GeoLocation();
        },
        teardown:function () {
            jQuery.ajax.restore();
            jQuery("object").remove();
            window.sessionStorage && window.sessionStorage.removeItem("geoLocation_countryCode");
        }
    });

    test("does not call if nothing on the page", function () {

        whenItLoads();

        then(jQuery.ajax).shouldHaveBeen(notCalled);

    });

    test("hides UK content if outside UK", function () {

        given(objectInCountry("GB"));
        given(userCountryCode = "GB");

        whenItLoads();

        then(jQuery("object")).shouldBe(visible);
        then(jQuery("object")).shouldBe(havingClass("suitable"));

    });

    test("shows UK content if within UK", function () {

        given(objectInCountry("GB"));
        given(userCountryCode = "US");

        whenItLoads();

        then(jQuery("object")).shouldBe(hidden);

    });

    test("geo location is case insensitive", function () {

        given(objectInCountry("GB"));
        given(userCountryCode = "gb");

        whenItLoads();

        then(jQuery("object")).shouldBe(visible);

    });

    test("doesnt call the AJAX service more than once", function () {

        given(userCountryCode = "gb");

        given(objectInCountry("GB"));
        whenItLoads();

        given(objectInCountry("GB"));
        whenItLoads();

        then(jQuery("object")).shouldBe(visible);

        then(jQuery.ajax).shouldHaveBeen(calledOnce);

    });

    if (window.sessionStorage) {
        test("location is persisted in session storage", function () {

            given(userCountryCode = "GB");
            given(sessionStorage.setItem("geoLocation_countryCode", "US"));

            given(objectInCountry("GB"));
            whenItLoads();

            then(jQuery("object")).shouldBe(hidden);

            then(jQuery.ajax).shouldHaveBeen(notCalled);

        });
    }

    /* End of Tests */

    var userCountryCode = "", geoLocation;

    function objectInCountry(countryCode) {
        jQuery("<object></object>")
            .attr("data-only-in-country", countryCode)
            .appendTo(document.body);
    }

    function whenItLoads() {
        geoLocation.init();
    }

    var given = when = function () {

    };

    function then(obj) {
        if (obj.jquery) {
            return {
                shouldBe:function (fn) {
                    fn(obj);
                }
            }
        } else {
            return {
                shouldHaveBeen:function (fn) {
                    fn(obj);
                }
            }
        }
    }

    function visible(obj) {
        ok(obj.length, "The object should be there");
    }

    function hidden(obj) {
        equal(obj.length, 0, "The object should NOT be there");
    }

    function havingClass(expectedClass) {
        return function (obj) {
            ok(obj.hasClass(expectedClass))
        }
    }

    function calledTimes(expectedTimes) {
        return function (stub) {
            equal(stub.callCount, expectedTimes, "The code should have been called the right number of times");
        }
    }

    var calledOnce = calledTimes(1), notCalled = calledTimes(0);

})();
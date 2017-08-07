(function () {
    "use strict";
})();
app.utils.misc = (function () {
    var USSTATES = {
            "AL": "Alabama",
            "AK": "Alaska",
            "AS": "American Samoa",
            "AZ": "Arizona",
            "AR": "Arkansas",
            "CA": "California",
            "CO": "Colorado",
            "CT": "Connecticut",
            "DE": "Delaware",
            "DC": "District Of Columbia",
            "FM": "Federated States Of Micronesia",
            "FL": "Florida",
            "GA": "Georgia",
            "GU": "Guam",
            "HI": "Hawaii",
            "ID": "Idaho",
            "IL": "Illinois",
            "IN": "Indiana",
            "IA": "Iowa",
            "KS": "Kansas",
            "KY": "Kentucky",
            "LA": "Louisiana",
            "ME": "Maine",
            "MH": "Marshall Islands",
            "MD": "Maryland",
            "MA": "Massachusetts",
            "MI": "Michigan",
            "MN": "Minnesota",
            "MS": "Mississippi",
            "MO": "Missouri",
            "MT": "Montana",
            "NE": "Nebraska",
            "NV": "Nevada",
            "NH": "New Hampshire",
            "NJ": "New Jersey",
            "NM": "New Mexico",
            "NY": "New York",
            "NC": "North Carolina",
            "ND": "North Dakota",
            "MP": "Northern Mariana Islands",
            "OH": "Ohio",
            "OK": "Oklahoma",
            "OR": "Oregon",
            "PW": "Palau",
            "PA": "Pennsylvania",
            "PR": "Puerto Rico",
            "RI": "Rhode Island",
            "SC": "South Carolina",
            "SD": "South Dakota",
            "TN": "Tennessee",
            "TX": "Texas",
            "UT": "Utah",
            "VT": "Vermont",
            "VI": "Virgin Islands",
            "VA": "Virginia",
            "WA": "Washington",
            "WV": "West Virginia",
            "WI": "Wisconsin",
            "WY": "Wyoming"
        },
        applyInAppBrowser = function (href) {
            if (href === "" || (typeof href == "undefined")) {
                return;
            }
            var ref = null;
            if ((href.indexOf('.pdf') !== -1) || (href.indexOf('.doc') !== -1)) {
                ref = window.open('https://docs.google.com/viewer?url=' + href + '&embedded=true', '_blank', 'toolbarposition=top,toolbar=yes');
            }
            else {
                ref = window.open(href, '_blank', 'toolbarposition=top,toolbar=yes');
            }


        },
        afterBBRender = function () {
            if (isInWeb) {
                $('.cordova-only').hide();
            }
            else {
                $('.non-cordova-only').hide();
            }
        },
        initFb = function () {
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s);
                js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&appId=1503339389930016&version=v1.0";
                try {
                    fjs.parentNode.insertBefore(js, fjs);
                }
                catch (e) {
                    console.log('Facebook sdk error: '.e);
                }
            }(document, 'script', 'facebook-jssdk'));
        },
        popover = {}
    ;
    return {
        USSTATES: USSTATES,
        findPopovers: function (target) {
            var i;
            var popovers = document.querySelectorAll('a');

            for (; target && target !== document; target = target.parentNode) {
                for (i = popovers.length; i--;) {
                    if (popovers[i] === target) {
                        return target;
                    }
                }
            }
        },
        getPopover: function (e) {
            var anchor = this.findPopovers(e.target);

            if (!anchor || !anchor.hash || (anchor.hash.indexOf('/') > 0)) {
                return;
            }

            try {
                popover = document.querySelector(anchor.hash);
            }
            catch (error) {
                popover = null;
            }

            if (popover === null) {
                return;
            }

            if (!popover || !popover.classList.contains('popover')) {
                return;
            }

            return popover;
        },
        hide_popover: function () {
            var popovers = $('.popover');
            $(popovers).removeClass('visible');
            $(popovers).removeClass('active');
            $(popovers).hide();
            $("div.backdrop").remove();
        },
        applyInAppBrowser: applyInAppBrowser,
        afterBBRender: afterBBRender,
        initFb: initFb,
        show_message: function (message, callback, title, buttonName) {
            title = title || "default title";
            buttonName = buttonName || 'OK';

            if (navigator.notification && navigator.notification.alert) {

                navigator.notification.alert(
                    message,    // message
                    callback,   // callback
                    title,      // title
                    buttonName  // buttonName
                );

            } else {

                alert(message);
                if (typeof callback === "function") {
                    callback();
                }
            }
        },
        //reverse geocoding
        //bbview : Backbone view to bind to callback
        geocodeLatLng: function geocodeLatLng(latlng, geocoder, callback, bbview) {
            geocoder.geocode({'location': latlng}, function () {
                callback(arguments[0], arguments[1], bbview);
            });
        },
        // Adds a marker to the map and push to the array.
        addMarker: function (location, type) {
            var icon = '';
            if (typeof location === "undefined" || !location || location === 0) {
                location = {lat: 0, lng: 0};
            }

            if (typeof type === "undefined" || !type) {
                type = 'default';
            }
            switch (type) {
                case 'rider_pickup':
                    icon = 'img/rider_on_map_new.png';
                    break;
                case 'rider_dropoff':
                    icon = 'img/dropoff_on_map_new.png';
                    break;
                default:
                    break;
            }
            var marker = new google.maps.Marker({
                position: location,
                map: map
            });
            map.markers.type = map.markers.type || [];
            map.markers.type.push(marker);
            return marker;
        },

        // Sets the map on all markers in the array.
        setMapOnAll: function (map_var) {
            // if (map_var == null) {
            //     for (var i = 0; i < map.markers.length; i++) {
            //         map.markers[i].setMap(null);
            //     }
            // } else {
            //     for (var i = 0; i < map.markers.length; i++) {
            //         map.markers[i].setMap(map);
            //     }
            // }
        },
        // Removes the markers from the map, but keeps them in the array.
        clearMarkers: function () {
            this.setMapOnAll(null);
        },
        // Shows any markers currently in the array.
        showMarkers: function () {
            this.setMapOnAll(map);
        },

// Deletes all markers in the array by removing references to them.
        deleteMarkers: function () {
            this.clearMarkers();
            map.markers = {};
        },
        //delete the marker on what we are about to pick
        delete_marker: function (address_to_pick) {
            var object_name = address_to_pick + '_marker';
            if (typeof map[object_name] == 'object') {
                map[object_name].setMap(null);

                if (map.directionsDisplay !== null) {
                    map.directionsDisplay.setMap(null);
                    map.directionsDisplay = null;
                }
            }
        },
        delete_markers: function (markers) {
            if (markers === null) {
                return;
            }
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
        }


    }
        ;

}());

//extending jQuery
$.fn.info = function () {
    var button = $('<i>').addClass('fa fa-times');
    button.click(function () {
        $(this).parent().slideUp();
    });
    this.prepend(button);
};

////extending jQuery

function array_keys_to_underscore(arr) {
    for (var key in arr) {
        var keyLower = s.underscored(key);
        // if key is not already lower case
        if (keyLower !== key) {
            var temp = arr[key];
            delete arr[key];
            arr[keyLower] = temp;
        }
    }
}

function ratchet_popover_dismiss() {
    var popovers = $('.popover');
    $(popovers).removeClass('visible');
    $(popovers).removeClass('active');
    $(popovers).hide();
    $("div.backdrop").remove();
}

function commuter_addr_to_full_addr(ca) {
    var full_addr = [ca.addrStreet1, ca.addrStreet2, ca.addrSuite, ca.addrCity, ca.addrState + ' ' + ca.addrZip].join(',');
    full_addr = start_case(full_addr);
    full_addr = full_addr.replace(/\s+/g, ' ').replace(/,+/g, ',').replace(/,/g, ', ').trim();
    return full_addr;
}

function start_case(s) {
    s = s.toLowerCase().trim();
    return s.replace(/\b(\w)/g, function (match) {
        return (match.toUpperCase());
    });
}

function lat_lng_distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (!unit) {
        unit = 'N';
    }
    if (unit == "K") {
        dist = dist * 1.609344;
    }
    if (unit == "N") {
        dist = dist * 0.8684;
    }
    return dist;
}

function name_initial_from_name(name) {
    if (_.isNull(name) || typeof name == "undefined")
        return '';
    name = name.replace('  ', ' ');
    var names = name.split(' ');
    if (names.length > 1) {
        names[1] = names[1][0];
    }
    return names.join(' ') + '.';
}

function ajax_timeout() {
    app.timeout_count = app.timeout_count || 0;
    app.timeout_count = (app.timeout_count + 1 ) % 4;//only show message every 4 timeout
    if (app.timeout_count === 0) {
        $('.page').removeClass('whirl traditional');
        app_toast("Service is currently offline");
    }
}

function ajax_timeout_reset() {
    app.timeout_count = 0;
    // console.info("timeout count" + app.timeout_count);
}

function ajax_timeout_request(model) {
    ajax_timeout();
    if (_.isObject(app.request_poller)) {
        app.request_poller.stop();
        app.request_poller.start();
    }
}

function ajax_timeout_my_request(model) {
    ajax_timeout();
    if (_.isObject(app.my_request_poller)) {
        app.my_request_poller.stop();
        app.my_request_poller.start();
    }
}

function ajax_timeout_driver(model) {
    ajax_timeout();
    if (_.isObject(app.driver_poller)) {
        app.driver_poller.stop();
        app.driver_poller.start();
    }
}

function ajax_timeout_offer(model) {
    ajax_timeout();
    if (_.isObject(app.offer_poller)) {
        app.offer_poller.stop();
        app.offer_poller.start();
    }
}

function ajax_timeout_my_offer(model) {
    ajax_timeout();
    if (_.isObject(app.my_offer_poller)) {
        app.my_offer_poller.stop();
        app.my_offer_poller.start();
    }
}
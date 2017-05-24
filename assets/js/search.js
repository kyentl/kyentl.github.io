var testLong = 0;
var testLat = 0;
var testType = ""
var map;
var service;
var searchResults;
var markers = [];
var myLocation = new google.maps.LatLng(testLat, testLong);
var icons = ["call_received", "call_made"];
var iconstate = 0;
var firstCenter = false;

$(document).ready(
    $('select').material_select(),
    initialize(),
    initRange(),
    initEventHandlers()
)

function initEventHandlers() {
    $("#mylocationsButton").click(function () {
        $("#mylocations").toggle(400)
    }),
        $('#searchButton').click(function (event) {
            event.preventDefault();
            search();
            $('form').toggle(400);

        }),
        $('#searchIcon').click(function () {
            $('form').toggle(400);


        })
        $('#sortButton').click(function(){
            searchResults.reverse();
            displaySearchResults();
            iconstate = (iconstate+1)%2
            $(this).find('i').html(icons[iconstate]);
        })


}

function initialize() {
    console.dir("gmap initialised: " + (map==null));
    getLocation();
    initializeMap();
    console.dir("gmap initialised: " + (map==null));
}

function store(jsonData) {
    if ((typeof Storage) !== void(0)) {
        var toStore = JSON.stringify(jsonData);
        var keyToGive;
        var found = false;
        var i=0;
        while (!found){
            if (localStorage.getItem(i) === null) {
                keyToGive = i;
                found = true

            }
            i = i+1;
        }
        localStorage.setItem(keyToGive, toStore);
    }
    else {
        Materialize.toast('Storage not supported in this browser', 4000);
    }

}


function getLocation() {
    console.dir("step 1");
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {
        Materialize.toast('Geolocation required', 4000);
    }

}

function showPosition(position) {

    var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    myLocation.latitude =position.coords.latitude;
    myLocation.longitude =position.coords.longitude; //werkt niet meer voor 1 of andere js rreden
    if(!firstCenter && !(map == null)){
        map.setCenter(center);
        firstCenter = true;
    }


}

/*
 ###############GEOFUNCTIONS
 */


function initializeMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: myLocation,
        zoom: 15
    });
    service = new google.maps.places.PlacesService(map);


}

function deleteMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}


function search() {


    var request = {
        location: map.getCenter(),
        radius: document.getElementById('range').value * 1000,
        type: document.getElementById('category').value,
        opennow: true
    };
    console.dir(request);
    service.nearbySearch(request, callback);

}


function callback(results, status) {
    console.dir(results);
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        for (var i = 0; i < results.length; i++) {
            var place = results[i];



            //Temporary foursquare ajax calls, mag weg bij evt google api update

            var latitude = place.geometry.location.lat();
            var longitude = place.geometry.location.lng();
            var fourSquareLatLng = (Math.round(latitude * 100) / 100) + "," + (Math.round(longitude * 100) / 100);
            $.ajax({
                method: "GET",
                async: false,
                url: "https://api.foursquare.com/v2/venues/search",
                data: {
                    client_id: "B0CP3ZGMQBYRTLK0VGC0PVXJR0ATYFVFYQ4P30DVQ4I2UXOE",
                    client_secret: "C12XYPPDEFAMAGOU01PNE3FSI2O2FKH0ULRMVG0VMBFPJ2B2",
                    v: "20170522",
                    m: "swarm",
                    ll: fourSquareLatLng,
                    intent: "match",
                    query: place.name
                }

            })
                .done(function (data) {
                    if (data.response.venues[0] == null) {
                        results[i]["hereNow"] = "unknown";
                    }
                    else {
                        var id = data.response.venues[0].id;
                        $.ajax({
                            method: "GET",
                            async: false,
                            url: "https://api.foursquare.com/v2/venues/" + id + "/herenow",
                            data: {
                                client_id: "B0CP3ZGMQBYRTLK0VGC0PVXJR0ATYFVFYQ4P30DVQ4I2UXOE",
                                client_secret: "C12XYPPDEFAMAGOU01PNE3FSI2O2FKH0ULRMVG0VMBFPJ2B2",
                                v: "20170522",
                                m: "swarm"
                            },

                        })
                            .done(function (data) {
                                results[i]["hereNow"] = data.response.hereNow.count;
                            });
                    }
                });


//google.navigation:q=street+address


        }
        searchResults = insertionSort(results);
        $('.loaderbox').toggle();
        displaySearchResults()

    }
}

function displaySearchResults() {
    $('#searchResults').find('*').not('.loaderbox').remove(); //extra divs met ids voorkomen, vermijden dat loaderbox verwijderd wordt. beter dan empty(), don't change

    $('.loaderbox').toggle();
    deleteMarkers();
    for (var i = 0; i < searchResults.length; i++) {
        var place = searchResults[i];
        $('#searchResults').append('<div class="result" id="' + i + '"> <div class="row"> <div class="col s8"><span id="name' + i + '"></span></div> <div class="col s1" id="distance' + i + '"></div> <div class="col s3 center-align" id="hereNow' + i + '"></div> </div> <div class="row hideUnhide" id="hideUnhide' + i + '"> <div class="col s12"><span id="address' + i + '">Near: </span> <span id="openNow' + i + '"></span> <span id="openUntil' + i + '"></span></div> <div class="col s6"></div> <div class="col s6"></div> <div class="col s6 center-align"><i class="waves-effect waves-light medium material-icons save" id="save' + i + '">label</i> </div> <div class="col s6 center-align"><a href="" class="navlink"><i class="waves-effect waves-light medium material-icons navigate" id="navigate' + i + '">navigation</i></a></div></div> </div>')

        $('#name' + i).html(place.name);
        $('#address' + i).append(place.vicinity);
        $('#hereNow' + (i)).append(place.hereNow);

        if (place.hasOwnProperty("opening_hours")) {
            if (!place.opening_hours.open_now) {
                $('#openNow' + i).html("Closed");
            }
            else {
                $('#openNow' + i).html("Open");
            }
        }
        else {
            $('#openNow' + i).html("No opening hours available");
        }
        marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: 'marker' + i,
        });
        markers.push(marker);

    }
    $(".result div:first-child").click(function () {

        var id = $(this).parent().attr('id');
        $("#hideUnhide" + id).toggle(400);
    })
    $(".navlink").attr("href", function () {
        var string = "https://www.google.com/maps/dir/?api=1&dir_action=navigate&destination=" ;
        var placeid = searchResults[$(this).parent().parent().parent().attr('id')].vicinity; //place idstring in de toekomst doen,werkt op dit moment niet correct wanneer dooorgegeven aan google.
    return string + placeid;
    });

    $(".save").click(function () {
        var id = $(this).parent().parent().parent().attr('id');
        console.dir(id);
        store(searchResults[id]);
    })
}

/*
 ######## METAFUNCTIONS
 */

function insertionSort(data) { //
    var unknownItems = [];
    var items = [];


    for (var k = 0; k < data.length; k++) {
        var result = data[k];
        if (result.hereNow === "unknown") {
            unknownItems.push(result);
        }
        else {
            items.push(result);
        }
    }

/*
    var len = items.length,     // number of items in the array
        value,                      // the value currently being compared
        i,                          // index into unsorted section
        j;                          // index into sorted section

    for (i = 0; i < len; i++) {

        // store the current value because it may shift later
        value = items[i];

        /*
         * Whenever the value in the sorted section is greater than the value
         * in the unsorted section, shift all items in the sorted section over
         * by one. This creates space in which to insert the value.

        for (j = i - 1; j > -1 && items[j] > value; j--) {
            items[j + 1] = items[j];
        }

        items[j + 1] = value;
    }
*/
    return items.concat(unknownItems);
}


/*
 ########## DOM ELEMENTS, INITIALISATION OF THE DOCUMENT
 */


function initRange() {
    var html5Slider = document.getElementById('rangeSlider');
    ;
    var select = document.getElementById('range');
    noUiSlider.create(html5Slider, {
        start: 5,
        step: 1,

        range: {
            'min': 1,
            'max': 10
        }

    });


    html5Slider.noUiSlider.on('update', function () {
        $('#range').val(html5Slider.noUiSlider.get());
    });

    $('#range').change(function () {
        html5Slider.noUiSlider.set(select.value);

    })
}
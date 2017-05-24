//https://api.foursquare.com/v2/venues/VENUE_ID/herenow
//https://maps.googleapis.com/maps/api/place/details/json?key=xxx&placeid=parameters
"use strict";
//get places near: https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=xxx&location=lat,long&radius=meters&opennow&type=type

var testLong = 0;
var testLat = 0;
var testRadius = 1000;
var markers = [];
var map;
var service;

var myLocation;

var marker;
var searchResults = [];
//open now checken, gemoetry>location



$(document).ready(
    $('select').material_select(),

    initialize(),
    $("#mylocationsButton").click(function(){   $("#mylocations").toggle(400)   })

)


function initialize() {
    getLocation();
    if ((typeof Storage) !== void(0)) {
        loadFromLocalStorage();
        displaySearchResults()
    }
    else {
        Materialize.toast('Storage not supported in this browser', 4000);
    }



}

function loadFromLocalStorage()
{
    for (var i = 0; i < localStorage.length; i++) {
       var result = localStorage.getItem(i);
        searchResults.push(JSON.parse(result));
    }

}

function test(){
    console.dir("does this execute");
}


function getLocation(initializeMap) {
    console.dir("step 1");
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {
        console.dir("no geoloc")
    }

}
function showPosition(position) {
    console.dir("step 2");
    testLat = position.coords.latitude;
    testLong = position.coords.longitude;
    initializeMap();

}


function deleteMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}


function initializeMap() {
    console.dir(testLat)
    console.dir("step 3");
 myLocation = new google.maps.LatLng(testLat, testLong);
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLocation,
        zoom: 15
    });
    service = new google.maps.places.PlacesService(map);

}

function displaySearchResults() {
    $('#mylocations').find('*').not('.loaderbox').remove(); //extra divs met ids voorkomen, vermijden dat loaderbox verwijderd wordt. beter dan empty(), don't change

    $('.loaderbox').toggle();
    deleteMarkers();
    for (var i = 0; i < searchResults.length; i++) {
        var place = searchResults[i];
        $('#mylocations').append('<div class="result" id="' + i + '"> <div class="row"> <div class="col s8"><span id="name' + i + '"></span></div> <div class="col s1" id="distance' + i + '"></div> <div class="col s3 center-align" id="hereNow' + i + '"></div> </div> <div class="row hideUnhide" id="hideUnhide' + i + '"> <div class="col s12"><span id="address' + i + '">Near: </span> <span id="openNow' + i + '"></span> <span id="maxHour' + i + '">Open until:</span></div> <div class="col s6"></div> <div class="col s6"></div> <div class="col s6 center-align"><i class="medium material-icons save" id="save' + i + '">label</i> </div> <div class="col s6 center-align"><a href="Manage"><i class="medium material-icons navigate" id="navigate' + i + '">navigation</i></a></div></div> </div>')

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
        console.dir("click registered");
        var id = $(this).parent().attr('id');
        $("#hideUnhide" + id).toggle(400);
    })
    $(".save").click(function () {
        var id = $(this).parent().parent().parent().attr('id');
        console.dir(id);
        store(searchResults[id]);
    })
}

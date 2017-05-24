//https://api.foursquare.com/v2/venues/VENUE_ID/herenow
//https://maps.googleapis.com/maps/api/place/details/json?key=xxx&placeid=parameters
"use strict";
//get places near: https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=xxx&location=lat,long&radius=meters&opennow&type=type


var testRadius = 1000;
var markers = [];
var map;
var service;
var  myLocation = new google.maps.LatLng(0, 0);
var marker;
var searchResults = [];
var firstCenter = false;
//open now checken, gemoetry>location



$(document).ready(
    $('select').material_select(),

    initialize(),
    $("#mylocationsButton").click(function(){   $("#mylocations").toggle(400)   })

)


function initialize() {
    getLocation();
    initializeMap();
    initWorkers();
    if ((typeof Storage) !== void(0)) {
        loadFromLocalStorage();

            try {displaySearchResults()}
            catch (e)
            {
                Materialize.toast('No locations saved yet', 4000);
            }


    }
    else {
        Materialize.toast('Storage not supported in this browser', 4000);
    }




}


function remove(id) {
    localStorage.removeItem(id);

}


function initWorkers(){

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('assets/js/sw.js')
            .then(function(reg) {
                // registration worked
                console.log('Registration succeeded. Scope is ' + reg.scope);
            }).catch(function(error) {
            // registration failed
            console.log('Registration failed with ' + error);
        });
    }
}

function loadFromLocalStorage()
{
    for (var key in localStorage) {
       var result = JSON.parse(localStorage.getItem(key));

         //check if record isnt corrupted
           searchResults.push(result);

    }

}


function getLocation() {

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


function deleteMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}


function initializeMap() {


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
        $('#mylocations').append('<div class="container"><div class="result" id="' + i + '"> <div class="row"> <div class="col s9"><span id="name' + i + '"></span></div> <div class="col s1" id="distance' + i + '"></div> <div class="col s3 center-align" id="icon' + i + '"></div> </div> <div class="row hideUnhide" id="hideUnhide' + i + '"> <div class="col s12"><span id="address' + i + '">Near: </span> <span id="openNow' + i + '"></span> <span id="openUntil' + i + '"></span></div> <div class="col s6"></div> <div class="col s6"></div> <div class="col s6 center-align"><i class="waves-effect waves-light medium material-icons save" id="save' + i + '">delete</i> </div> <div class="col s6 center-align"><a href="" class="navlink" target="_blank"><i class="waves-effect waves-light  medium material-icons navigate" id="navigate' + i + '">navigation</i></a></div></div> </div></div>')

        $('#name' + i).html(place.name);
        $('#address' + i).append(place.vicinity);
        //Icoon van placetype toevoegen, zit al in searchResults en is plaats voorzien bij #icon

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
    $(".navlink").attr("href", function () {
        var string = "https://www.google.com/maps/dir/?api=1&dir_action=navigate&destination=" ;
        var placeid = searchResults[$(this).parent().parent().parent().attr('id')].vicinity; //place idstring in de toekomst doen,werkt op dit moment niet correct wanneer dooorgegeven aan google.
        return string + placeid;
    });

    $(".save").click(function () {
        var id = $(this).parent().parent().parent().attr('id');
        remove(id);
        searchResults.splice(id, 1);
        displaySearchResults();
    })
}

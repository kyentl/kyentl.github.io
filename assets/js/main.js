//https://api.foursquare.com/v2/venues/VENUE_ID/herenow
//https://maps.googleapis.com/maps/api/place/details/json?key=xxx&placeid=parameters
"use strict";
//get places near: https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=xxx&location=lat,long&radius=meters&opennow&type=type

var testLong = 0;
var testLat = 0;
var testRadius = 1000;
var testType = ""
var map;
var service;
var bounds;
var infowindow;
var myLocation;
var ne;
var sw;
var marker;
//open now checken, gemoetry>location



$(document).ready(
    $('select').material_select(),

    initialize(),
    $("#mylocationsButton").click(function(){   $("#mylocations").toggle(400)   })

)


function initialize() {
    getLocation();
    console.dir(testLat);
    //initializeMap();
   //search();

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


function search() {


console.dir(myLocation);
    var request = {
        location: myLocation,
        radius: testRadius,
        types: ['store']
    };
   service.nearbySearch(request, callback);


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


    search();
}

function callback(results, status) {
    marker = new google.maps.Marker({
        map: map,

        position: myLocation
    });
    console.dir(results);
    var marker;
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            marker = new google.maps.Marker({
                map: map,
               position: place.geometry.location,
               title: 'opp'+i,

           });
           marker.setMap(map);



        }console.dir("-------------")
        console.dir(marker);
        marker.setMap(map);
    }
}
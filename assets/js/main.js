//https://api.foursquare.com/v2/venues/VENUE_ID/herenow
//https://maps.googleapis.com/maps/api/place/details/json?key=xxx&placeid=parameters
"use strict";
//get places near: https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=xxx&location=lat,long&radius=meters&opennow&type=type

var testLong = 3.101275;
var testLat = 51.066835;
var testRadius = 1000;
var testType = ""
var map;
var service;
var infowindow;
var myLocation = new google.maps.LatLng(testLat, testLong);
//open now checken, gemoetry>location



$(document).ready(
    initialize(),
    search(),
    $("#mylocationsButton").click(function(){   $("#mylocations").toggle(400)   })


)








function search() {
    var request = {
        location: myLocation,
        radius: testRadius,
        types: ['store']
    };
   service.nearbySearch(request, callback);

   /* $.ajax({
        dataType: "jsonp",
        method: "GET",
        url: " https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        data: {key: "AIzaSyBFe-d_rFQwfSX3z2Er3Hh3pWxBrjns-MQ", location: testLat + "," + testLong, radius: testRadius}
    })
        .done(function (data) {
            // console.dir(data);
        });

*/
}


function initialize() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: myLocation,
        zoom: 15
    });
    service = new google.maps.places.PlacesService(map);



}

function callback(results, status) {
    console.dir(results);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
           var marker = new google.maps.Marker({
               location: new google.maps.LatLng(testLat, testLong),
               visible: true,
               title: "opp",
               map: map

           });


        }
    }
}
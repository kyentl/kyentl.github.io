
var testLong = 3.101275;
var testLat = 51.066835;
var testRadius = 1000;
var testType = ""
var map;
var service;
var infowindow;
var myLocation = new google.maps.LatLng(testLat, testLong);

$(document).ready(
    $('select').material_select(),
    //initialize(),
    search(),
    $("#mylocationsButton").click(function(){   $("#mylocations").toggle(400)   }),
    $('#searchButton').click(function(event) {
        event.preventDefault();
        search();
        
    })

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




function callback(results, status) {
    console.dir(results);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];



        }
    }
}
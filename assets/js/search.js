
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
    initialize(),
    initRange(),
    $("#mylocationsButton").click(function(){   $("#mylocations").toggle(400)   }),
    $('#searchButton').click(function(event) {
        event.preventDefault();
        search();
        
    })

)

function initialize() {
    getLocation();
    //initializeMap();
    //search();

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
    $('#searchResults').empty();
    console.dir($('#range').value);
    var request = {
        location: myLocation,
        radius: document.getElementById('range').value*1000,
        type: document.getElementById('category').value
    };
    console.dir(request);
    service.nearbySearch(request, callback);

}




function callback(results, status) {
    console.dir(results);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                title: 'marker'+i,

            });

            $('#searchResults').append('<div class="result" id="'+i+'"> <div class="row"> <div class="col s8"><span id="name'+i+'">Naam van het etablissement bla</span></div> <div class="col s2">200</div> <div class="col s2">5000</div> </div> <div class="row hideUnhide" id="hideUnhide"> <div class="col s12"><span id="address'+i+'">Address:</span> <span id="phone'+i+'">Phone</span> <span id="maxHour'+i+'">Open until:</span></div> <div class="col s6"></div> <div class="col s6"></div> </div> </div>')
            $('#name'+i).html(place.name);
            $('#phone'+i).append('testje');

        }
    }
}



function initRange(){
    var html5Slider = document.getElementById('rangeSlider');;
    var select = document.getElementById('range');
    noUiSlider.create(html5Slider, {
        start: 10,
        step: 1,

        range: {
            'min': 1,
            'max': 20
        }

    });


    html5Slider.noUiSlider.on('update', function(){
        $('#range').val(html5Slider.noUiSlider.get());
    });

    $('#range').change(function(){
        html5Slider.noUiSlider.set(select.value);

    })
}

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
    initializeFacebook();
    //initializeMap();
    //search();

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

function initializeFacebook() {
    $.ajax({
        url: "http://fiddle.jshell.net/favicon.png",
        beforeSend: function( xhr ) {
            xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
        }
    })
        .done(function( data ) {
            if ( console && console.log ) {
                console.log( "Sample of data:", data.slice( 0, 100 ) );
            }
        });

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



            $('#searchResults').append('<div class="result" id="'+i+'"> <div class="row"> <div class="col s8"><span id="name'+i+'">Naam van het etablissement bla</span></div> <div class="col s2" id="distance'+i+'">200</div> <div class="col s2" id="hereNow'+i+'"></div> </div> <div class="row hideUnhide" id="hideUnhide"> <div class="col s12"><span id="address'+i+'">Address:</span> <span id="phone'+i+'">Phone</span> <span id="maxHour'+i+'">Open until:</span></div> <div class="col s6"></div> <div class="col s6"></div> </div> </div>')

            $('#name'+i).html(place.name);
            $('#phone'+i).append('testje');


            //Temporary foursquare ajax calls, mag weg bij evt google api update

            var latitude = place.geometry.location.lat();
            var longitude = place.geometry.location.lng();
            var fourSquareLatLng = (Math.round(latitude * 100) / 100) +","+ (Math.round(longitude * 100) / 100);
            $.ajax({
                method: "GET" ,
                async: false,
                url: "https://api.foursquare.com/v2/venues/search",
                data: { client_id: "B0CP3ZGMQBYRTLK0VGC0PVXJR0ATYFVFYQ4P30DVQ4I2UXOE", client_secret: "C12XYPPDEFAMAGOU01PNE3FSI2O2FKH0ULRMVG0VMBFPJ2B2", v:"20170522", m:"swarm", ll: fourSquareLatLng, intent:"match", query: place.name}

            })
                .done(function( data ) {
                    if (data.response.venues[0] == null)
                    {

                        $('#hereNow'+(i)).append('unknown');
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
                                $('#hereNow'+(i)).append(data.response.hereNow.count);
                            });
                    }
                });





//google.navigation:q=street+address


        }
    }
}



function initRange(){
    var html5Slider = document.getElementById('rangeSlider');;
    var select = document.getElementById('range');
    noUiSlider.create(html5Slider, {
        start: 5,
        step: 1,

        range: {
            'min': 1,
            'max': 10
        }

    });


    html5Slider.noUiSlider.on('update', function(){
        $('#range').val(html5Slider.noUiSlider.get());
    });

    $('#range').change(function(){
        html5Slider.noUiSlider.set(select.value);

    })
}
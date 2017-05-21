
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
    initRange(),
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

}




function callback(results, status) {
    console.dir(results);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];



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
        },
        pips: { // Show a scale with the slider
            mode: 'steps',
            stepped: true,
            density: 1
        }
    });


    html5Slider.noUiSlider.on('update', function(){
        $('#range').val(html5Slider.noUiSlider.get());
    });

    $('#range').change(function(){
        html5Slider.noUiSlider.set(select.value);

    })
}
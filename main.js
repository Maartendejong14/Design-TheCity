hideDruppelImage();
// Create a Leaflet map centered on Rotterdam
var map = L.map('map').setView([51.9225, 4.47917], 1);

// Add a tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 30,
}).addTo(map);

// Initialize variables to hold the Prins Alexander and Kralingen-Crooswijk features
var prinsAlexanderFeature;
var kralingenCrooswijkFeature;

// Initialize variables for markers
var customSouthMarker; customNorthMarker; customEastMarker; customWestMarker; customCentreMarker;
var geoJSONLayerVisible = false;

var textContainerNorth = document.getElementById('text-containerNorth'); // Get textContainer4
var textContainerSouth = document.getElementById('text-containerSouth'); // Get textContainer4
var textContainerWest = document.getElementById('text-containerWest'); // Get textContainer4
var textContainerEast = document.getElementById('text-containerEast'); // Get textContainer4
var textContainerCentre = document.getElementById('text-containerCentre'); // Get textContainer4

var textContainerNorthstage = document.getElementById('text-containerNorthstage'); // Get textContainer4
var textContainerSouthstage = document.getElementById('text-containerSouthstage'); // Get textContainer4
var textContainerWeststage = document.getElementById('text-containerWeststage'); // Get textContainer4
var textContainerEaststage = document.getElementById('text-containerEaststage'); // Get textContainer4
var textContainerCentrestage = document.getElementById('text-containerCentrestage'); // Get textContainer4


// Load the GeoJSON data and add it to the map
fetch('rotterdam.geojson')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // Combine regions with the same color
        var mergedFeatures = {};
        data.features.forEach(function (feature) {
            if (feature.properties.name === "Nieuw Mathenesse" || feature.properties.name === "Delfshaven") {
                feature.properties.name = "West";
            }

            if (feature.properties.name === "Kralingen-Crooswijk" || feature.properties.name === "Prins Alexander") {
                feature.properties.name = "East";
            }

            if (feature.properties.name === "Charlois" || feature.properties.name === "Waalhaven" || feature.properties.name === "Feijenoord" || feature.properties.name === "ijsselmonde") {
                feature.properties.name = "South";
            }

            if (!mergedFeatures[feature.properties.name]) {
                mergedFeatures[feature.properties.name] = feature;
            } else {
                // Merge regions with the same color
                var existingFeature = mergedFeatures[feature.properties.name];
                existingFeature.geometry.coordinates = existingFeature.geometry.coordinates.concat(feature.geometry.coordinates);
            }
        });

        // Convert the merged features object back to an array
        var mergedData = { type: "FeatureCollection", features: Object.values(mergedFeatures) };

        var geoJSONLayer = L.geoJSON(mergedData, {
            style: function (feature) {
                if (feature.properties.name === "East") {
                    return { fillColor: '#00AEEF', color: '#00AEEF', weight: 2, fillOpacity: 0.5 };
                } else if (feature.properties.name === "North") {
                    return { fillColor: '#00A651', color: '#00A651', weight: 2, fillOpacity: 0.5 };
                } else if (feature.properties.name === "Centre") {
                    return { fillColor: '#FFF200', color: '#FFF200', weight: 2, fillOpacity: 0.5 };
                } else if (feature.properties.name === "West") {
                    return { fillColor: '#ED1C24', color: '#ED1C24', weight: 2, fillOpacity: 0.5 };
                } else if (feature.properties.name === "South") {
                    return { fillColor: '#EC008C', color: '#EC008C', weight: 2, fillOpacity: 0.5 };
                } else {
                    return { fillColor: '#ffffff', color: '#ffffff', weight: 2, fillOpacity: 0.5 };
                }
            },
            onEachFeature: function (feature, layer) {
                layer.on({
                    mouseover: function (e) {
                        layer.setStyle({ fillOpacity: 0.8 });

                        // Display the text when hovering over the region
                        var regionInfo = document.getElementById('region-info-' + feature.properties.name.toLowerCase());
                        regionInfo.innerHTML = feature.properties.name;
                        regionInfo.style.display = 'block';


                    },
                    mouseout: function (e) {
                        layer.setStyle({ fillOpacity: 0.5 });

                        // Hide the text when the mouse leaves the region
                        var regionInfo = document.getElementById('region-info-' + feature.properties.name.toLowerCase());
                        regionInfo.style.display = 'none';

                    },
                    click: function (e) {
                        var slider = document.getElementById('slider');

                        switch (slider.value) {
                            case '4':
                                switch (feature.properties.name) {
                                    case 'South':
                                        hideNorthImage();
                                        showSouthImage();
                                        hideCentreImage();
                                        hideEastImage();
                                        hideWestImage();
                                        textContainerSouthstage.style.display = 'block';
                                        textContainerCentrestage.style.display = 'none';
                                        textContainerNorthstage.style.display = 'none';
                                        textContainerEaststage.style.display = 'none';
                                        textContainerWeststage.style.display = 'none';
                                        break;
                                    case 'East':
                                        hideNorthImage();
                                        hideSouthImage();
                                        hideCentreImage();
                                        showEastImage();
                                        hideWestImage();
                                        textContainerEaststage.style.display = 'block';
                                        textContainerCentrestage.style.display = 'none';
                                        textContainerNorthstage.style.display = 'none';
                                        textContainerSouthstage.style.display = 'none';
                                        textContainerWeststage.style.display = 'none';
                                        break;
                                    case 'North':
                                        showNorthImage();
                                        hideSouthImage();
                                        hideCentreImage();
                                        hideEastImage();
                                        hideWestImage();
                                        textContainerNorthstage.style.display = 'block';
                                        textContainerCentrestage.style.display = 'none';
                                        textContainerSouthstage.style.display = 'none';
                                        textContainerEaststage.style.display = 'none';
                                        textContainerWeststage.style.display = 'none';
                                        break;
                                    case 'West':
                                        hideNorthImage();
                                        hideSouthImage();
                                        hideCentreImage();
                                        hideEastImage();
                                        showWestImage();
                                        textContainerWeststage.style.display = 'block';
                                        textContainerCentrestage.style.display = 'none';
                                        textContainerNorthstage.style.display = 'none';
                                        textContainerSouthstage.style.display = 'none';
                                        textContainerEaststage.style.display = 'none';
                                        break;
                                    case 'Centre':
                                        hideNorthImage();
                                        hideSouthImage();
                                        showCentreImage();
                                        hideEastImage();
                                        hideWestImage();
                                        textContainerCentrestage.style.display = 'block';
                                        textContainerNorthstage.style.display = 'none';
                                        textContainerSouthstage.style.display = 'none';
                                        textContainerEaststage.style.display = 'none';
                                        textContainerWeststage.style.display = 'none';
                                        break;
                                }
                                hideDruppelImage();
                                break;


                            case '3':
                                switch (feature.properties.name) {
                                    case 'South':
                                        hideNorthbossImage();
                                        showSouthbossImage();
                                        hideCentrebossImage();
                                        hideEastbossImage();
                                        hideWestbossImage();
                                        break;
                                    case 'East':
                                        hideNorthbossImage();
                                        hideSouthbossImage();
                                        hideCentrebossImage();
                                        showEastbossImage();
                                        hideWestbossImage();
                                        break;
                                    case 'North':
                                        showNorthbossImage();
                                        hideSouthbossImage();
                                        hideCentrebossImage();
                                        hideEastbossImage();
                                        hideWestbossImage();
                                        break;
                                    case 'West':
                                        hideNorthbossImage();
                                        hideSouthbossImage();
                                        hideCentrebossImage();
                                        hideEastbossImage();
                                        showWestbossImage();
                                        break;
                                    case 'Centre':
                                        hideNorthbossImage();
                                        hideSouthbossImage();
                                        showCentrebossImage();
                                        hideEastbossImage();
                                        hideWestbossImage();
                                        break;
                                }
                                break;
                        }
                    }
                });
                layer.bindLabel(feature.properties.name); // Add labels to regions
            }
        }).addTo(map);



        // Function to handle slider changes
        // Function to handle slider changes
        // Function to handle slider changes
        function handleSliderChange() {
            var slider = document.getElementById('slider');
            var sliderText = document.getElementById('slider-text');
            var textContainer = document.getElementById('text-container');
            var textContainer2 = document.getElementById('text-container2'); // Get textContainer4
            var textContainer3 = document.getElementById('text-container3');
            var textContainer4 = document.getElementById('text-container4'); // Get textContainer4
            var textContainer5 = document.getElementById('text-container5'); // Get textContainer4

            var selectedValue = parseInt(slider.value);
            console.log("Selected value: " + selectedValue); // Add this line to check the selected value




            //new

            if (selectedValue === 1) {
                if (geoJSONLayerVisible) {
                    map.removeLayer(geoJSONLayer);
                    geoJSONLayerVisible = false;
                }
                textContainer.style.display = 'block'; // Hide the general text container
                textContainer2.style.display = 'none'; // Hide textContainer4
                textContainer3.style.display = 'none'; // Hide the general text container
                textContainer4.style.display = 'none'; // Hide textContainer4
                textContainer5.style.display = 'none'; // Hide the general text container
                textContainerNorth.style.display = 'none';
                textContainerSouth.style.display = 'none';
                textContainerEast.style.display = 'none';
                textContainerWest.style.display = 'none';
                textContainerCentre.style.display = 'none';

                sliderText.innerText = "Step 1: Introduction";
                hideImages();
                hideAllImages()
                customSouthMarker.remove();
                customNorthMarker.remove();
                customEastMarker.remove();
                customWestMarker.remove();
                customCentreMarker.remove();

            }

            else if (selectedValue === 2) {
                if (!geoJSONLayerVisible) {
                    geoJSONLayer.addTo(map);
                    geoJSONLayerVisible = true;
                }
                hideImages();
                hideAllImages()
                textContainer.style.display = 'none'; // Hide the general text container
                textContainer2.style.display = 'block'; // Hide textContainer4
                textContainer3.style.display = 'none'; // Hide the general text container
                textContainer4.style.display = 'none'; // Hide textContainer4
                textContainer5.style.display = 'none'; // Hide the general text container
                textContainerNorth.style.display = 'none';
                textContainerSouth.style.display = 'none';
                textContainerEast.style.display = 'none';
                textContainerWest.style.display = 'none';
                textContainerCentre.style.display = 'none';

                sliderText.innerText = "Step 2: Characteristics";
                customSouthMarker.remove();
                customNorthMarker.remove();
                customEastMarker.remove();
                customWestMarker.remove();
                customCentreMarker.remove();
            }
            else if (selectedValue === 3) {
                if (!geoJSONLayerVisible) {
                    geoJSONLayer.addTo(map);
                    geoJSONLayerVisible = true;
                }
                hideImages();
                hideAllImages()
                textContainer.style.display = 'none'; // Hide the general text container
                textContainer2.style.display = 'none'; // Hide textContainer4
                textContainer3.style.display = 'block'; // Hide the general text container
                textContainer4.style.display = 'none'; // Hide textContainer4
                textContainer5.style.display = 'none'; // Hide the general text container
                textContainerNorth.style.display = 'none';
                textContainerSouth.style.display = 'none';
                textContainerEast.style.display = 'none';
                textContainerWest.style.display = 'none';
                textContainerCentre.style.display = 'none';

                sliderText.innerText = "Step 3: Values";
                customSouthMarker.remove();
                customNorthMarker.remove();
                customEastMarker.remove();
                customWestMarker.remove();
                customCentreMarker.remove();
            }
            else if (selectedValue === 4) {
                if (!geoJSONLayerVisible) {
                    geoJSONLayer.addTo(map);
                    geoJSONLayerVisible = true;
                }
                showDruppelImage();
                textContainer.style.display = 'none'; // Hide the general text container
                textContainer2.style.display = 'none'; // Hide textContainer4
                textContainer3.style.display = 'none'; // Hide the general text container
                textContainer4.style.display = 'block'; // Hide textContainer4
                textContainer5.style.display = 'none'; // Hide the general text container
                textContainerNorth.style.display = 'none';
                textContainerSouth.style.display = 'none';
                textContainerEast.style.display = 'none';
                textContainerWest.style.display = 'none';
                textContainerCentre.style.display = 'none';

                sliderText.innerText = "Step 4: Stage of adoption";
                customSouthMarker.remove();
                customNorthMarker.remove();
                customEastMarker.remove();
                customWestMarker.remove();
                customCentreMarker.remove();
            }

            else if (selectedValue === 5) {
                if (!geoJSONLayerVisible) {
                    geoJSONLayer.addTo(map);
                    geoJSONLayerVisible = true;
                }
                customSouthMarker.addTo(map);
                customNorthMarker.addTo(map);
                customEastMarker.addTo(map);
                customWestMarker.addTo(map);
                customCentreMarker.addTo(map);

                hideImages();
                hideAllImages()
                textContainer.style.display = 'none'; // Hide the general text container
                textContainer2.style.display = 'none'; // Hide textContainer4
                textContainer3.style.display = 'none'; // Hide the general text container
                textContainer4.style.display = 'none'; // Hide textContainer4
                textContainer5.style.display = 'block'; // Hide the general text container
                textContainerNorth.style.display = 'none';
                textContainerSouth.style.display = 'none';
                textContainerEast.style.display = 'none';
                textContainerWest.style.display = 'none';
                textContainerCentre.style.display = 'none';
                sliderText.innerText = "Step 5: Defined design intervention";

            }
            else {
                if (geoJSONLayerVisible) {
                    map.removeLayer(geoJSONLayer);
                    geoJSONLayerVisible = false;
                }
                hideImages();
                hideAllImages()
                customSouthMarker.remove();
                customNorthMarker.remove();
                customEastMarker.remove();
                customWestMarker.remove();
                customCentreMarker.remove();
                sliderText.innerText = "Step 1: Introduction";
                textContainer.style.display = 'block'; // Hide the general text container
                textContainer2.style.display = 'none'; // Hide textContainer4
                textContainer3.style.display = 'none'; // Hide the general text container
                textContainer4.style.display = 'none'; // Hide textContainer4
                textContainer5.style.display = 'none'; // Hide the general text container
                textContainerNorth.style.display = 'none';
                textContainerSouth.style.display = 'none';
                textContainerEast.style.display = 'none';
                textContainerWest.style.display = 'none';
                textContainerCentre.style.display = 'none';
            }
        }
        // Add an event listener to respond to slider changes
        var slider = document.getElementById('slider');
        slider.addEventListener('input', handleSliderChange);

        // Add an event listener to respond to slider changes
        var slider = document.getElementById('slider');
        slider.addEventListener('input', handleSliderChange);

        // Fit the map to the bounds of the GeoJSON data and store Prins Alexander and Kralingen-Crooswijk features
        map.fitBounds(geoJSONLayer.getBounds());
    });

// Define the functions to show/hide images (these functions are outside of the click event)

function showSouthImage() {
    var southImage = document.getElementById('south-image');
    if (southImage) {
        southImage.style.display = 'block';
    }
}

function hideSouthImage() {
    var southImage = document.getElementById('south-image');
    if (southImage) {
        southImage.style.display = 'none';
    }
}

function showEastImage() {
    var eastImage = document.getElementById('east-image');
    if (eastImage) {
        eastImage.style.display = 'block';
    }
}

function hideEastImage() {
    var eastImage = document.getElementById('east-image');
    if (eastImage) {
        eastImage.style.display = 'none';
    }
}

function showNorthImage() {
    var northImage = document.getElementById('north-image');
    if (northImage) {
        northImage.style.display = 'block';
    }
}

function hideNorthImage() {
    var northImage = document.getElementById('north-image');
    if (northImage) {
        northImage.style.display = 'none';
    }
}

function showWestImage() {
    var westImage = document.getElementById('west-image');
    if (westImage) {
        westImage.style.display = 'block';
    }
}

function hideWestImage() {
    var westImage = document.getElementById('west-image');
    if (westImage) {
        westImage.style.display = 'none';
    }
}

function showCentreImage() {
    var centreImage = document.getElementById('centre-image');
    if (centreImage) {
        centreImage.style.display = 'block';
    }
}

function hideCentreImage() {
    var centreImage = document.getElementById('centre-image');
    if (centreImage) {
        centreImage.style.display = 'none';
    }
}

function showDruppelImage() {
    var druppelImage = document.getElementById('druppel-image');
    if (druppelImage) {
        druppelImage.style.display = 'block';
    }
}

function hideDruppelImage() {
    var druppelImage = document.getElementById('druppel-image');
    if (druppelImage) {
        druppelImage.style.display = 'none';
    }
}





function showSouthbossImage() {
    var southImageboss = document.getElementById('south-imageboss');
    if (southImageboss) {
        southImageboss.style.display = 'block';
    }
}

function hideSouthbossImage() {
    var southImageboss = document.getElementById('south-imageboss');
    if (southImageboss) {
        southImageboss.style.display = 'none';
    }
}

function showEastbossImage() {
    var eastImageboss = document.getElementById('east-imageboss');
    if (eastImageboss) {
        eastImageboss.style.display = 'block';
    }
}

function hideEastbossImage() {
    var eastImageboss = document.getElementById('east-imageboss');
    if (eastImageboss) {
        eastImageboss.style.display = 'none';
    }
}

function showNorthbossImage() {
    var northImageboss = document.getElementById('north-imageboss');
    if (northImageboss) {
        northImageboss.style.display = 'block';
    }
}

function hideNorthbossImage() {
    var NorthImageboss = document.getElementById('north-imageboss');
    if (NorthImageboss) {
        NorthImageboss.style.display = 'none';
    }
}

function showWestbossImage() {
    var westImageboss = document.getElementById('west-imageboss');
    if (westImageboss) {
        westImageboss.style.display = 'block';
    }
}

function hideWestbossImage() {
    var westImageboss = document.getElementById('west-imageboss');
    if (westImageboss) {
        westImageboss.style.display = 'none';
    }
}

function showCentrebossImage() {
    var centreImageboss = document.getElementById('centre-imageboss');
    if (centreImageboss) {
        centreImageboss.style.display = 'block';
    }
}

function hideCentrebossImage() {
    var centreImageboss = document.getElementById('centre-imageboss');
    if (centreImageboss) {
        centreImageboss.style.display = 'none';
    }
}

function showDruppelImage() {
    var druppelImage = document.getElementById('druppel-image');
    if (druppelImage) {
        druppelImage.style.display = 'block';
    }
}

function hideDruppelImage() {
    var druppelImage = document.getElementById('druppel-image');
    if (druppelImage) {
        druppelImage.style.display = 'none';
    }
}

function hideImages() {
    hideDruppelImage();
    hideSouthImage();
    hideEastImage();
    hideNorthImage();
    hideWestImage();
    hideCentreImage();
    hideSouthbossImage();
    hideEastbossImage();
    hideNorthbossImage();
    hideWestbossImage();
    hideCentrebossImage();
}


// Create a marker at the specified coordinates
var customSouthMarker = L.marker([51.891936, 4.457411]);
customSouthMarker.bindPopup("<img src='designsouth.png' alt='Image' style='max-width: 100%; max-height: 100%;'><div style='width: 400px;'></div>");

var customNorthMarker = L.marker([51.926567, 4.448856]);
customNorthMarker.bindPopup("<img src='designcentre.jpg' alt='Image' style='max-width: 100%; max-height: 100%;'><div style='width: 400px;'></div>");

var customEastMarker = L.marker([51.916563, 4.523473]);
customEastMarker.bindPopup("<img src='designeast.jpg' alt='Image' style='max-width: 100%; max-height: 100%;'><div style='width: 400px;'></div>");

var customWestMarker = L.marker([51.920031, 4.452317]);
customWestMarker.bindPopup("<img src='designwest.jpg' alt='Image' style='max-width: 100%; max-height: 100%;'><div style='width: 400px;'></div>");

var customCentreMarker = L.marker([51.923108, 4.487418]);
customCentreMarker.bindPopup("<img src='designcentre2.jpg' alt='Image' style='max-width: 100%; max-height: 100%;'><div style='width: 400px;'></div>");

customNorthMarker.on('click', function () {
    var textContainerNorth = document.getElementById('text-containerNorth');
    if (textContainerNorth) {
        textContainerNorth.style.display = 'block';
        textContainerSouth.style.display = 'none';
        textContainerEast.style.display = 'none';
        textContainerWest.style.display = 'none';
        textContainerCentre.style.display = 'none';
    }
});

customSouthMarker.on('click', function () {
    var textContainerSouth = document.getElementById('text-containerSouth');
    if (textContainerSouth) {
        textContainerSouth.style.display = 'block';
        textContainerNorth.style.display = 'none';
        textContainerEast.style.display = 'none';
        textContainerWest.style.display = 'none';
        textContainerCentre.style.display = 'none';
    }
});

customEastMarker.on('click', function () {
    var textContainerEast = document.getElementById('text-containerEast');
    if (textContainerEast) {
        textContainerEast.style.display = 'block';
        textContainerNorth.style.display = 'none';
        textContainerSouth.style.display = 'none';
        textContainerWest.style.display = 'none';
        textContainerCentre.style.display = 'none';
    }
});

customWestMarker.on('click', function () {
    var textContainerWest = document.getElementById('text-containerWest');
    if (textContainerWest) {
        textContainerWest.style.display = 'block';
        textContainerNorth.style.display = 'none';
        textContainerSouth.style.display = 'none';
        textContainerEast.style.display = 'none';
        textContainerCentre.style.display = 'none';
    }
});

customCentreMarker.on('click', function () {
    var textContainerCentre = document.getElementById('text-containerCentre');
    if (textContainerCentre) {
        textContainerCentre.style.display = 'block';
        textContainerNorth.style.display = 'none';
        textContainerSouth.style.display = 'none';
        textContainerEast.style.display = 'none';
        textContainerWest.style.display = 'none';
    }
});
function hideAllImages() {
    // Hide all text containers and images
    textContainerSouthstage.style.display = 'none';
    hideSouthImage();
    textContainerEaststage.style.display = 'none';
    hideEastImage();
    textContainerNorthstage.style.display = 'none';
    hideNorthImage();
    textContainerWeststage.style.display = 'none';
    hideWestImage();
    textContainerCentrestage.style.display = 'none';
    hideCentreImage();
}
function hideAllBossImages() {
    // Hide all boss images
    hideSouthbossImage();
    hideEastbossImage();
    hideNorthbossImage();
    hideWestbossImage();
    hideCentrebossImage();
}

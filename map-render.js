//Create a 2D view
require(["esri/Map", "esri/views/MapView"], (Map, MapView) => {
  const map = new Map({
    basemap: "topo-vector",
  });

  const view = new MapView({
    container: "viewDiv", // Reference to the DOM node that will contain the view
    map: map, // References the map object created in step 3
  });
});

var map;
var list_points = [];
var string_points = "";

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
], function (Map, MapView, Graphic, GraphicsLayer) {
  const map = new Map({
    basemap: "topo-vector",
  });

  //Tao Map hien thi
  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [106.7054125, 10.7743341],
    zoom: 16,
  });

  // Tao lop chua
  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  //Tao diem
  const point = {
    type: "point",
    longitude: 106.70546100330755,
    latitude: 10.774203232036433,
  };

  const locationSymbol = {
    type: "simple-marker",
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z", // SVG path hình giọt nước
    color: "red",
    size: 10,
    outline: {
      color: "white",
      width: 1,
    },
  };

  const pointGraphic = new Graphic({
    geometry: point,
    symbol: locationSymbol,
  });

  graphicsLayer.add(pointGraphic);

  view.popup.autoOpenEnabled = false; // Disable the default popup behavior
  view.on("click", function (event) {
    // Listen for the click event
    view.hitTest(event).then(function (hitTestResults) {
      // Search for features where the user clicked
      if (hitTestResults.results) {
        list_points.push([event.mapPoint.longitude, event.mapPoint.latitude]);
        string_points +=
          "[" +
          event.mapPoint.longitude +
          ", " +
          event.mapPoint.latitude +
          "],";
        copyTextToClipboard(string_points);
        // console.log(list_points);
      }
    });
  });
});

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
  "esri/widgets/Search",
  "esri/widgets/Home",
  "esri/widgets/Locate",
  "esri/widgets/Compass",
  "esri/widgets/Fullscreen",
], function (
  Map,
  MapView,
  Graphic,
  GraphicsLayer,
  Search,
  Home,
  Locate,
  Compass,
  Fullscreen
) {
  map = new Map({
    basemap: "topo-vector",
  });
  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [106.70447025643149, 10.77188049479451],
    zoom: 16,
  });
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
  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  // Search
  const search = new Search({ view });
  view.ui.add(search, "top-right");

  // Home
  const home = new Home({ view });
  view.ui.add(home, "top-left");

  // Locate
  const locate = new Locate({ view });
  view.ui.add(locate, "top-left");

  // Compass
  const compass = new Compass({ view });
  view.ui.add(compass, "top-left");

  // Fullscreen
  const fullscreen = new Fullscreen({
    view: view,
    element: document.getElementById("viewDiv"),
  });
  view.ui.add(fullscreen, "top-right");

  // Load du lieu tu file json

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      data.features.forEach((feature) => {
        let geometry;

        if (feature.geometry.type === "Point") {
          geometry = {
            type: "point",
            longitude: feature.geometry.coordinates[0],
            latitude: feature.geometry.coordinates[1],
          };
        } else if (feature.geometry.type === "Polyline") {
          geometry = {
            type: "polyline",
            paths: feature.geometry.coordinates,
          };
        } else if (feature.geometry.type === "Polygon") {
          geometry = {
            type: "polygon",
            rings: feature.geometry.coordinates,
          };
        }

        const symbol = feature.symbol || {
          type: "picture-marker",
          color: "blue",
          size: 8,
        };

        const graphic = new Graphic({
          geometry: geometry,
          symbol: feature.symbol,
          popupTemplate: {
            title: feature.properties.title,
            content: feature.properties.description,
          },
        });
        graphicsLayer.add(graphic);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi fetch JSON:", error);
    });
});

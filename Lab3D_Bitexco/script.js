require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer"
  ], function (Map, SceneView, Graphic, GraphicsLayer) {
    const map = new Map({
      basemap: "topo-vector",
      ground: "world-elevation"
    });
  
    const view = new SceneView({
      container: "viewDiv",
      map: map,
      center: [106.705, 10.772], // Tọa độ Bitexco Tower
      zoom: 17,
      camera: {
        position: {
          x: 106.705,
          y: 10.772,
          z: 300
        },
        tilt: 65
      }
    });
  
    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

  
    fetch("data.json")
      .then(response => response.json())
      .then(data => {
        const bitexco = new Graphic({
          geometry: {
            type: "point",
            longitude: data.longitude,
            latitude: data.latitude,
            z: data.z
          },
          symbol: {
            type: "point-3d",
            symbolLayers: [{
              type: "object",
              resource: { primitive: "cylinder" },
              material: { color: "#5A9BD4" },
              height: data.height,
              width: data.width,
              depth: data.depth
            }]
          },
          popupTemplate: {
            title: data.title,
            content: data.description
          }
        });
        graphicsLayer.add(bitexco);
      })
      .catch(err => console.error("Lỗi tải JSON:", err));
  });
  
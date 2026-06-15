import "./style.css";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0OGNlNzA2Yi02ZDFmLTRmZjEtYjg2OS00OGZjYTM1MTIwMmMiLCJpZCI6NDQ0NzIyLCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODE1MjU4ODh9.zYyzLK3lYtJBFTPxBgTp6AzuRMxaj3zDPdifHwTmLdQ";
const viewer = new Cesium.Viewer("app", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
});
const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (click) {
  const cartesian = viewer.camera.pickEllipsoid(
    click.position,
    viewer.scene.globe.ellipsoid
  );
  if (cartesian) {
    const cartographic =
      Cesium.Cartographic.fromCartesian(cartesian);

    const lon = Cesium.Math.toDegrees(
      cartographic.longitude
    );
const lat = Cesium.Math.toDegrees(
      cartographic.latitude
    );
  alert(
      `Breitengrad: ${lat.toFixed(5)}
Längengrad: ${lon.toFixed(5)}`
    );
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(4944208);
viewer.scene.primitives.add(tileset);

let highlightedFeature;
let originalColor = new Cesium.Color();

const hoverHandler = new Cesium.ScreenSpaceEventHandler(
  viewer.scene.canvas
);

hoverHandler.setInputAction(function (movement) {

  // Vorheriges Gebäude zurücksetzen
  if (highlightedFeature) {
    highlightedFeature.color = Cesium.Color.clone(
      originalColor,
      highlightedFeature.color
    );
    highlightedFeature = undefined;
  }

  const pickedFeature = viewer.scene.pick(
    movement.endPosition
  );

  if (
    !Cesium.defined(pickedFeature) ||
    !(pickedFeature instanceof Cesium.Cesium3DTileFeature)
  ) {
    return;
  }

  highlightedFeature = pickedFeature;

  Cesium.Color.clone(
    pickedFeature.color,
    originalColor
  );

  pickedFeature.color = Cesium.Color.CYAN;

}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


tileset.style = new Cesium.Cesium3DTileStyle({
	
  color: "color('red', 0.8)"
});
await viewer.zoomTo(tileset); 
tileset.style = new Cesium.Cesium3DTileStyle({
  color: {
    conditions: [
      ["${Height} >= 60", "color('red')"],
      ["${Height} >= 30", "color('orange')"],
      ["${Height} >= 10", "color('yellow')"],
      ["true", "color('lightgray')"]
    ]
  }
});
viewer.scene.globe.enableLighting = true;
viewer.clock.currentTime =
  Cesium.JulianDate.fromDate(
    new Date("2025-01-01T22:00:00")
  );
handler.setInputAction(function (click) {

  const pickedFeature =
    viewer.scene.pick(click.position);

  if (
    Cesium.defined(pickedFeature) &&
    pickedFeature instanceof Cesium.Cesium3DTileFeature
  ) {

    const position =
      viewer.scene.pickPosition(click.position);

    if (!Cesium.defined(position)) {
      return;
    }

    const sphere =
      new Cesium.BoundingSphere(
        position,
        30
      );

    viewer.camera.flyToBoundingSphere(
      sphere,
      {
        duration: 2,
        offset:
          new Cesium.HeadingPitchRange(
            viewer.camera.heading,
            Cesium.Math.toRadians(-25),
            80
          )
      }
    );

  }

}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
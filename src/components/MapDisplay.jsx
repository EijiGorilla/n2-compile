import { useEffect, useState } from "react";
import "../index.css";
import "../App.css";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-placement";
import "@arcgis/map-components/components/arcgis-compass";
import {
  structureLayer,
  pierAccessLayer,
  prowLayer,
  handedOverLotLayer,
  viaductLayer,
  buildingLayer,
  utilityGroupLayer,
  treeGroupLayer,
  lotGroupLayer,
  ngcp2_groupLayer,
  nloLoOccupancyGroupLayer,
  alignmentGroupLayer,
} from "../layers";

import "@esri/calcite-components/dist/components/calcite-button";

function MapDisplay() {
  const [sceneView, setSceneView] = useState();
  const arcgisScene = document.querySelector("arcgis-scene");

  useEffect(() => {
    if (sceneView) {
      arcgisScene.map.add(buildingLayer);
      arcgisScene.map.add(viaductLayer);
      arcgisScene.map.add(pierAccessLayer);
      arcgisScene.map.add(utilityGroupLayer);
      arcgisScene.map.add(treeGroupLayer);
      arcgisScene.map.add(lotGroupLayer);
      arcgisScene.map.add(ngcp2_groupLayer);
      arcgisScene.map.add(structureLayer);
      arcgisScene.map.add(nloLoOccupancyGroupLayer);
      arcgisScene.map.add(alignmentGroupLayer);
      arcgisScene.map.add(prowLayer);
      arcgisScene.map.add(handedOverLotLayer);
      arcgisScene.map.ground.navigationConstraint = "none";
      arcgisScene.view.environment.atmosphereEnabled = false;
    }
  });

  return (
    <arcgis-scene
      // item-id="5ba14f5a7db34710897da0ce2d46d55f"
      basemap="dark-gray-vector"
      ground="world-elevation"
      viewingMode="local"
      zoom="18"
      center="120.5793, 15.18"
      onarcgisViewReadyChange={(event) => {
        setSceneView(event.target);
      }}
    >
      <arcgis-compass position="top-right"></arcgis-compass>
      <arcgis-zoom position="bottom-right"></arcgis-zoom>
    </arcgis-scene>
  );
}

export default MapDisplay;

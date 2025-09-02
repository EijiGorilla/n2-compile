import "@esri/calcite-components/dist/components/calcite-tabs";
import "@esri/calcite-components/dist/components/calcite-tab";
import "@esri/calcite-components/dist/components/calcite-tab-nav";
import "@esri/calcite-components/dist/components/calcite-tab-title";
import "@esri/calcite-components/dist/calcite/calcite.css";
import {
  CalciteTab,
  CalciteTabs,
  CalciteTabNav,
  CalciteTabTitle,
} from "@esri/calcite-components-react";
import { useEffect, useState } from "react";
import { buildingLayer, lotLayer } from "../layers";
import LotChart from "./LotChart";

import "../index.css";
import "../App.css";
import StructureChart from "./StructureChart";
import NloChart from "./NloChart";
import ViaductChart from "./ViaductChart";
import TreeChart from "./TreeChart";
import UtilityChart from "./UtilityChart";

function MainChart() {
  const [lotLayerLoaded, setLotLayerLoaded] = useState<any>();
  const [buildingLayerLoaded, setBuildingLayerLoaded] = useState<any>(); // 'loaded'

  useEffect(() => {
    buildingLayer.load().then(() => {
      setBuildingLayerLoaded(buildingLayer.loadStatus);
    });
  });

  useEffect(() => {
    lotLayer.load().then(() => {
      setLotLayerLoaded(lotLayer.loadStatus);
    });
  });

  return (
    <>
      <CalciteTabs
        style={{
          borderStyle: "solid",
          borderRightWidth: 5,
          borderLeftWidth: 5,
          borderBottomWidth: 5,
          borderTopWidth: 0,
          borderColor: "#555555",
        }}
        slot="panel-end"
        layout="center"
        scale="m"
      >
        <CalciteTabNav slot="title-group" id="thetabs">
          <CalciteTabTitle class="Land">Land</CalciteTabTitle>
          <CalciteTabTitle class="Structure">Structure</CalciteTabTitle>
          <CalciteTabTitle class="Households">Households</CalciteTabTitle>
          <CalciteTabTitle class="Tree">Tree</CalciteTabTitle>
          <CalciteTabTitle class="Utility">Utility</CalciteTabTitle>
          <CalciteTabTitle class="Viaduct">Viaduct</CalciteTabTitle>
        </CalciteTabNav>

        {/* CalciteTab: Lot */}
        <CalciteTab>{lotLayerLoaded === "loaded" && <LotChart />}</CalciteTab>

        {/* CalciteTab: Structure */}
        <CalciteTab>
          <StructureChart />
        </CalciteTab>

        {/* CalciteTab: Non-Land Owner */}
        <CalciteTab>
          <NloChart />
        </CalciteTab>

        {/* CalciteTab: Tree */}
        <CalciteTab>
          <TreeChart />
        </CalciteTab>

        {/* CalciteTab: Utility */}
        <CalciteTab>
          <UtilityChart />
        </CalciteTab>

        {/* CalciteTab: Viaduct */}
        <CalciteTab>
          {buildingLayerLoaded === "loaded" ? <ViaductChart /> : ""}
        </CalciteTab>
      </CalciteTabs>
    </>
  );
}

export default MainChart;

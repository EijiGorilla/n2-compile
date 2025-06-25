import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-list-item";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import "@esri/calcite-components/dist/components/calcite-action";
import "@esri/calcite-components/dist/components/calcite-action-bar";
import "@arcgis/map-components/components/arcgis-building-explorer";
import {
  CalciteShellPanel,
  CalciteActionBar,
  CalciteAction,
  CalcitePanel,
} from "@esri/calcite-components-react";
import { useEffect, useState } from "react";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-direct-line-measurement-3d";
import "@arcgis/map-components/components/arcgis-area-measurement-3d";
import { defineActions } from "../Query";
import {
  ngcp_tagged_structureLayer,
  ngcp_working_area,
  utilityLineNGCP,
} from "../layers";
import LotProgressChart from "./LotProgressChart";
import HandedOverAreaChart from "./HandedOverAreaChart";
import ViaductChart from "./ViaductChart";
import ViaductProgressChart from "./ViaductProgressChart";

function ActionPanel() {
  const arcgisScene = document.querySelector("arcgis-scene");
  const [activeWidget, setActiveWidget] = useState(null);
  const [nextWidget, setNextWidget] = useState(null);

  const directLineMeasure = document.querySelector(
    "arcgis-direct-line-measurement-3d"
  );
  const areaMeasure = document.querySelector("arcgis-area-measurement-3d");

  useEffect(() => {
    if (activeWidget) {
      const actionActiveWidget = document.querySelector(
        `[data-panel-id=${activeWidget}]`
      );
      actionActiveWidget.hidden = true;
      directLineMeasure
        ? directLineMeasure.clear()
        : console.log("Line measure is cleared");
      areaMeasure
        ? areaMeasure.clear()
        : console.log("Area measure is cleared.");
    }

    if (nextWidget !== activeWidget) {
      const actionNextWidget = document.querySelector(
        `[data-panel-id=${nextWidget}]`
      );
      actionNextWidget.hidden = false;
    }
  });

  return (
    <>
      <CalciteShellPanel
        width="1"
        slot="panel-start"
        position="start"
        id="left-shell-panel"
        displayMode="dock"
        style={{
          borderStyle: "solid",
          borderLeftWidth: 1,
        }}
      >
        <CalciteActionBar slot="action-bar">
          <CalciteAction
            data-action-id="layers"
            icon="layers"
            text="layers"
            id="layers"
            //textEnabled={true}
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          <CalciteAction
            data-action-id="basemaps"
            icon="basemap"
            text="basemaps"
            id="basemaps"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          <CalciteAction
            data-action-id="charts"
            icon="graph-time-series"
            text="Progress Chart"
            id="charts"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          <CalciteAction
            data-action-id="handedover-charts"
            icon="graph-bar-side-by-side"
            text="Handed-Over Area"
            id="handedover-charts"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          <CalciteAction
            data-action-id="viaduct-charts"
            icon="graph-bar-stacked"
            text="Viaduct Construction"
            id="viaduct-charts"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          <CalciteAction
            data-action-id="directline-measure"
            icon="measure-line"
            text="Line Measurement"
            id="directline-measure"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          <CalciteAction
            data-action-id="area-measure"
            icon="measure-area"
            text="Area Measurement"
            id="area-measure"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          <CalciteAction
            data-action-id="information"
            icon="information"
            text="Information"
            id="information"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>
        </CalciteActionBar>

        <CalcitePanel
          heading="Layers"
          height="l"
          width="l"
          data-panel-id="layers"
          style={{ width: "18vw" }}
          hidden
        >
          <arcgis-layer-list
            referenceElement="arcgis-scene"
            selectionMode="multiple"
            visibilityAppearance="checkbox"
            show-filter
            filter-placeholder="Filter layers"
            listItemCreatedFunction={defineActions}
            onarcgisTriggerAction={(event) => {
              const { id } = event.detail.action;

              if (id === "full-extent-ngcpworkarea") {
                arcgisScene
                  ?.goTo(ngcp_working_area.fullExtent)
                  .catch((error) => {
                    if (error.name !== "AbortError") {
                      console.error(error);
                    }
                  });
              } else if (id === "full-extent-taggedstructure") {
                arcgisScene
                  ?.goTo(ngcp_tagged_structureLayer.fullExtent)
                  .catch((error) => {
                    if (error.name !== "AbortError") {
                      console.error(error);
                    }
                  });
              } else if (id === "full-extent-ngcpline") {
                arcgisScene?.goTo(utilityLineNGCP.fullExtent).catch((error) => {
                  if (error.name !== "AbortError") {
                    console.error(error);
                  }
                });
              }
            }}
          ></arcgis-layer-list>
        </CalcitePanel>

        <CalcitePanel
          heading="Basemaps"
          height="l"
          data-panel-id="basemaps"
          style={{ width: "18vw" }}
          hidden
        >
          <arcgis-basemap-gallery referenceElement="arcgis-scene"></arcgis-basemap-gallery>
        </CalcitePanel>

        <CalcitePanel
          class="timeSeries-panel"
          height-scale="l"
          data-panel-id="charts"
          hidden
        ></CalcitePanel>

        <CalcitePanel
          class="handedOverArea-panel"
          height-scale="l"
          data-panel-id="handedover-charts"
          hidden
        ></CalcitePanel>

        <CalcitePanel
          class="timeSeries-panel"
          height-scale="l"
          data-panel-id="viaduct-charts"
          hidden
        ></CalcitePanel>

        <CalcitePanel
          heading="Direct Line Measure"
          height="l"
          width="l"
          data-panel-id="directline-measure"
          style={{ width: "18vw" }}
          hidden
        >
          <arcgis-direct-line-measurement-3d
            id="directLineMeasurementAnalysisButton"
            referenceElement="arcgis-scene"
            // onarcgisPropertyChange={(event) => console.log(event.target.id)}
          ></arcgis-direct-line-measurement-3d>
        </CalcitePanel>

        <CalcitePanel
          heading="Area Measure"
          height="l"
          width="l"
          data-panel-id="area-measure"
          style={{ width: "18vw" }}
          hidden
        >
          <arcgis-area-measurement-3d
            id="areaMeasurementAnalysisButton"
            referenceElement="arcgis-scene"
            icon="measure-area"
          ></arcgis-area-measurement-3d>
        </CalcitePanel>

        <CalcitePanel heading="Description" data-panel-id="information" hidden>
          {nextWidget === "information" ? (
            <div className="informationDiv">
              <ul>
                <li>
                  You can <b>filter utility data</b> by contract package,
                  company, and data type: (point or line) using dropdown lists
                  in the header panel.
                </li>
                <br />
                <li>
                  <b>Click bar-chart series</b> to view 'Complete' or
                  'Incomplete' progress on work status by individual utitliy
                  types over the map.
                </li>
                <br />
                <li>
                  Click/unclick widgets icon for viewing Layer list, Legend, and
                  Basemaps in the action panel.
                </li>
              </ul>
            </div>
          ) : (
            <div className="informationDiv" hidden></div>
          )}
        </CalcitePanel>
      </CalciteShellPanel>
      {nextWidget === "charts" && nextWidget !== activeWidget && (
        <LotProgressChart />
      )}

      {nextWidget === "handedover-charts" && nextWidget !== activeWidget && (
        <HandedOverAreaChart />
      )}

      {nextWidget === "viaduct-charts" && nextWidget !== activeWidget && (
        <ViaductProgressChart />
      )}
    </>
  );
}

export default ActionPanel;

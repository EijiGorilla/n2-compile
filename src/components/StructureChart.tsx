import { useEffect, useRef, useState, memo, use } from "react";
import { structureLayer } from "../layers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import Query from "@arcgis/core/rest/support/Query";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import {
  generateStrucNumber,
  generateStructureData,
  thousands_separators,
  statusStructureChart,
  dateUpdate,
} from "../Query";
import {
  chard_width,
  cutoff_days,
  primaryLabelColor,
  updatedDateCategoryNames,
  valueLabelColor,
} from "../StatusUniqueValues";
import "@esri/calcite-components/dist/components/calcite-label";
import { CalciteLabel } from "@esri/calcite-components-react";
import { MyContext } from "../App";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

///*** Others */

/// Draw chart
const StructureChart = memo(() => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const { contractpackages } = use(MyContext);

  // 0. Updated date
  const [asOfDate, setAsOfDate] = useState<undefined | any | unknown>(null);
  const [daysPass, setDaysPass] = useState<boolean>(false);
  useEffect(() => {
    dateUpdate(updatedDateCategoryNames[1]).then((response: any) => {
      setAsOfDate(response[0][0]);
      setDaysPass(response[0][1] >= cutoff_days ? true : false);
    });
  }, []);

  // 1. Structure
  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [structureData, setStructureData] = useState([
    {
      category: String,
      value: Number,
      sliceSettings: {
        fill: am5.color("#00c5ff"),
      },
    },
  ]);

  const chartID = "structure-chart";
  const [structureNumber, setStructureNumber] = useState([]);

  // Query
  const queryDefault = "1=1";
  const queryContractp = "CP = '" + contractpackages + "'";

  if (contractpackages === "All") {
    structureLayer.definitionExpression = queryDefault;
  } else {
    structureLayer.definitionExpression = queryContractp;
  }

  useEffect(() => {
    generateStructureData(contractpackages).then((result: any) => {
      setStructureData(result);
    });

    // Structure Number
    generateStrucNumber().then((response: any) => {
      setStructureNumber(response);
    });
  }, [contractpackages]);

  useEffect(() => {
    // Dispose previously created root element

    maybeDisposeRoot(chartID);

    var root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    var chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );
    chartRef.current = chart;

    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    var pieSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        categoryField: "category",
        valueField: "value",
        //legendLabelText: "[{fill}]{category}[/]",
        legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
        radius: am5.percent(45), // outer radius
        innerRadius: am5.percent(28),
        scale: 2,
      })
    );
    pieSeriesRef.current = pieSeries;
    chart.series.push(pieSeries);

    // values inside a donut
    let inner_label = pieSeries.children.push(
      am5.Label.new(root, {
        text: "[#ffffff]{valueSum}[/]\n[fontSize: 0.5em; #d3d3d3; verticalAlign: super]STRUCTURES[/]",
        fontSize: "1.1rem",
        centerX: am5.percent(50),
        centerY: am5.percent(40),
        populateText: true,
        oversizedBehavior: "fit",
        textAlign: "center",
      })
    );

    pieSeries.onPrivate("width", (width: any) => {
      inner_label.set("maxWidth", width * 0.7);
    });

    // Set slice opacity and stroke color
    pieSeries.slices.template.setAll({
      toggleKey: "none",
      fillOpacity: 0.9,
      stroke: am5.color("#ffffff"),
      strokeWidth: 0.5,
      strokeOpacity: 1,
      templateField: "sliceSettings",
    });

    // Disabling labels and ticksll
    pieSeries.labels.template.setAll({
      // fill: am5.color('#ffffff'),
      // fontSize: '0.5rem',
      visible: false,
      scale: 0,
      // oversizedBehavior: 'wrap',
      // maxWidth: 65,
      // text: "{category}: [#C9CC3F; fontSize: 10px;]{valuePercentTotal.formatNumber('#.')}%[/]",
    });

    // pieSeries.labels.template.set('visible', true);
    pieSeries.ticks.template.setAll({
      // fillOpacity: 0.9,
      // stroke: am5.color('#ffffff'),
      // strokeWidth: 0.3,
      // strokeOpacity: 1,
      visible: false,
      scale: 0,
    });

    // EventDispatcher is disposed at SpriteEventDispatcher...
    // It looks like this error results from clicking events
    pieSeries.slices.template.events.on("click", (ev) => {
      const selected: any = ev.target.dataItem?.dataContext;
      const categorySelect: string = selected.category;
      const find = statusStructureChart.find(
        (emp: any) => emp.category === categorySelect
      );
      const statusSelect = find?.value;

      var highlightSelect: any;
      var query = structureLayer.createQuery();

      arcgisScene?.whenLayerView(structureLayer).then((layerView: any) => {
        //chartLayerView = layerView;

        structureLayer.queryFeatures(query).then(function (results) {
          const RESULT_LENGTH = results.features;
          const ROW_N = RESULT_LENGTH.length;

          let objID = [];
          for (var i = 0; i < ROW_N; i++) {
            var obj = results.features[i].attributes.OBJECTID;
            objID.push(obj);
          }

          var queryExt = new Query({
            objectIds: objID,
          });

          structureLayer.queryExtent(queryExt).then(function (result) {
            if (result.extent) {
              arcgisScene?.view.goTo(result.extent);
            }
          });

          if (highlightSelect) {
            highlightSelect.remove();
          }
          highlightSelect = layerView.highlight(objID);

          arcgisScene?.view.on("click", function () {
            layerView.filter = new FeatureFilter({
              where: undefined,
            });
            highlightSelect.remove();
          });
        }); // End of queryFeatures

        layerView.filter = new FeatureFilter({
          where: "StatusStruc = " + statusSelect,
        });
      }); // End of view.whenLayerView
    });

    pieSeries.data.setAll(structureData);

    // Legend
    // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
      })
    );
    legendRef.current = legend;
    legend.data.setAll(pieSeries.dataItems);

    // Change the size of legend markers
    legend.markers.template.setAll({
      width: 18,
      height: 18,
    });

    // Change the marker shape
    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusBR: 10,
    });

    // Responsive legend
    // https://www.amcharts.com/docs/v5/tutorials/pie-chart-with-a-legend-with-dynamically-sized-labels/
    // This aligns Legend to Left
    chart.onPrivate("width", function (width: any) {
      const boxWidth = 230; //props.style.width;
      var availableSpace = Math.max(
        width - chart.height() - boxWidth,
        boxWidth
      );
      //var availableSpace = (boxWidth - valueLabelsWidth) * 0.7
      legend.labels.template.setAll({
        width: availableSpace,
        maxWidth: availableSpace,
      });
    });

    // To align legend items: valueLabels right, labels to left
    // 1. fix width of valueLabels
    // 2. dynamically change width of labels by screen size

    // Change legend labelling properties
    // To have responsive font size, do not set font size
    legend.labels.template.setAll({
      oversizedBehavior: "truncate",
      fill: am5.color("#ffffff"),
      //textDecoration: "underline"
      //width: am5.percent(200)
      //fontWeight: "300"
    });

    legend.valueLabels.template.setAll({
      textAlign: "right",
      //width: valueLabelsWidth,
      fill: am5.color("#ffffff"),
      //fontSize: LEGEND_FONT_SIZE,
    });

    legend.itemContainers.template.setAll({
      // set space between legend items
      paddingTop: 3,
      paddingBottom: 1,
    });

    pieSeries.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [chartID, structureData]);

  useEffect(() => {
    pieSeriesRef.current?.data.setAll(structureData);
    legendRef.current?.data.setAll(pieSeriesRef.current.dataItems);
  });

  return (
    <>
      <div
        style={{
          color: primaryLabelColor,
          fontSize: "1.2rem",
          marginLeft: "13px",
          marginTop: "10px",
        }}
      >
        TOTAL STRUCTURES
      </div>
      <CalciteLabel layout="inline">
        <b className="totalLotsNumber" style={{ color: valueLabelColor }}>
          <div
            style={{
              color: valueLabelColor,
              fontSize: "2rem",
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              marginLeft: "15px",
            }}
          >
            {thousands_separators(structureNumber[2])}
          </div>
          <img
            src="https://EijiGorilla.github.io/Symbols/House_Logo.svg"
            alt="Land Logo"
            height={"60px"}
            width={"60px"}
            style={{ marginLeft: "290px", display: "flex", marginTop: "-50px" }}
          />
        </b>
      </CalciteLabel>

      <div
        style={{
          color: daysPass === true ? "red" : "gray",
          fontSize: "0.8rem",
          float: "right",
          marginRight: "5px",
        }}
      >
        {!asOfDate ? "" : "As of " + asOfDate}
      </div>

      {/* Structure Chart */}
      <div
        id={chartID}
        style={{
          width: chard_width,
          height: "50vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          marginTop: "30px",
          marginBottom: "10%",
        }}
      ></div>

      <div
        style={{
          color: primaryLabelColor,
          fontSize: "1.2rem",
          // marginBottom: '13px',
          marginLeft: "13px",
        }}
      >
        PERMIT-TO-ENTER
      </div>
      <CalciteLabel layout="inline">
        {structureNumber[1] === 0 ? (
          <b className="permitToEnterNumber" style={{ color: valueLabelColor }}>
            {structureNumber[0]}% (0)
          </b>
        ) : (
          <b className="permitToEnterNumber" style={{ color: valueLabelColor }}>
            {structureNumber[0]}% ({thousands_separators(structureNumber[1])})
          </b>
        )}

        <img
          src="https://EijiGorilla.github.io/Symbols/Permit-To-Enter.png"
          alt="Structure Logo"
          height={"50px"}
          width={"50px"}
          style={{ margin: "auto", marginRight: "40px" }}
        />
      </CalciteLabel>
    </>
  );
}); // End of lotChartgs

export default StructureChart;

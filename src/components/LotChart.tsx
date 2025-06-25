import { useEffect, useRef, useState, use } from "react";
import { handedOverLotLayer, lotLayer } from "../layers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import Query from "@arcgis/core/rest/support/Query";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import {
  dateUpdate,
  generateHandedOverArea,
  generateHandedOverLotsNumber,
  generateLotData,
  generateLotNumber,
  highlightLot,
  highlightRemove,
  thousands_separators,
  zoomToLayer,
} from "../Query";
import "../App.css";
import "@esri/calcite-components/dist/components/calcite-label";
import "@esri/calcite-components/dist/components/calcite-checkbox";
import { CalciteLabel, CalciteCheckbox } from "@esri/calcite-components-react";
import {
  cpField,
  cutoff_days,
  lotStatusField,
  primaryLabelColor,
  querySuperUrgent,
  statusLotQuery,
  superurgent_items,
  updatedDateCategoryNames,
  valueLabelColor,
} from "../StatusUniqueValues";
import SuperUrgentSegmentedList from "./SuperUrgentLotContext";
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
const LotChart = () => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const { contractpackages } = use(MyContext);
  const { superurgentswitch } = use(MyContext);
  // 0. Updated date
  const [asOfDate, setAsOfDate] = useState<undefined | any | unknown>(null);
  const [daysPass, setDaysPass] = useState<boolean>(false);
  useEffect(() => {
    dateUpdate(updatedDateCategoryNames[0]).then((response: any) => {
      setAsOfDate(response[0][0]);
      setDaysPass(response[0][1] >= cutoff_days ? true : false);
    });
  }, []);

  // 1. Land Acquisition
  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [lotData, setLotData] = useState([
    {
      category: String,
      value: Number,
      sliceSettings: {
        fill: am5.color("#00c5ff"),
      },
    },
  ]);

  const chartID = "pie-two";

  const [lotNumber, setLotNumber] = useState([]);
  const [handedOverNumber, setHandedOverNumber] = useState([]);

  // Handed Over View checkbox
  const [handedOverCheckBox, setHandedOverCheckBox] = useState<boolean>(false);
  const [handedOverArea, setHandedOverArea] = useState<any>();

  // Query

  const queryDefault = "1=1";
  const queryContractp = `${cpField} = '` + contractpackages + "'";
  const querySuperUrgentCp = querySuperUrgent + " AND " + queryContractp;

  if (superurgentswitch === superurgent_items[0]) {
    if (contractpackages === "All") {
      lotLayer.definitionExpression = queryDefault;
      handedOverLotLayer.definitionExpression = queryDefault;
    } else {
      lotLayer.definitionExpression = queryContractp;
      handedOverLotLayer.definitionExpression = queryContractp;
    }
  } else if (superurgentswitch === superurgent_items[1]) {
    // ON
    if (contractpackages === "All") {
      lotLayer.definitionExpression = querySuperUrgent;
      handedOverLotLayer.definitionExpression = querySuperUrgent;
    } else {
      lotLayer.definitionExpression = querySuperUrgentCp;
      handedOverLotLayer.definitionExpression = querySuperUrgentCp;
    }
  }

  useEffect(() => {
    if (superurgentswitch === superurgent_items[1]) {
      zoomToLayer(lotLayer, arcgisScene);
      highlightLot(lotLayer, arcgisScene);
    } else {
      highlightRemove(lotLayer);
    }
  }, [superurgentswitch]);

  useEffect(() => {
    if (handedOverCheckBox === true) {
      handedOverLotLayer.visible = true;
    } else {
      handedOverLotLayer.visible = false;
    }
  }, [handedOverCheckBox]);

  useEffect(() => {
    generateLotData().then((result: any) => {
      setLotData(result);
    });

    // Lot number
    generateLotNumber().then((response: any) => {
      setLotNumber(response);
    });

    generateHandedOverLotsNumber(superurgentswitch, contractpackages).then(
      (response: any) => {
        setHandedOverNumber(response);
      }
    );

    generateHandedOverArea(superurgentswitch, contractpackages).then(
      (response: any) => {
        setHandedOverArea(response);
      }
    );

    zoomToLayer(lotLayer, arcgisScene);
  }, [superurgentswitch, contractpackages]);

  // 1. Pie Chart for Land Acquisition
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
        // legendLabelText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
        // '{category}[/] ([#C9CC3F; bold]{valuePercentTotal.formatNumber("#.")}%[/]) '

        legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
        radius: am5.percent(45), // outer radius
        innerRadius: am5.percent(28),
        scale: 2.5,
      })
    );
    pieSeriesRef.current = pieSeries;
    chart.series.push(pieSeries);

    // values inside a donut
    let inner_label = pieSeries.children.push(
      am5.Label.new(root, {
        text: "[#ffffff]{valueSum}[/]\n[fontSize: 0.5em; #d3d3d3; verticalAlign: super]PRIVATE LOTS[/]",
        fontSize: "1rem",
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
      const categorySelected: string = selected.category;
      const find = statusLotQuery.find(
        (emp: any) => emp.category === categorySelected
      );
      const statusSelect = find?.value;

      var highlightSelect: any;

      var query = lotLayer.createQuery();

      arcgisScene?.whenLayerView(lotLayer).then((layerView: any) => {
        //chartLayerView = layerView;

        lotLayer.queryFeatures(query).then(function (results) {
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

          lotLayer.queryExtent(queryExt).then(function (result) {
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
          where: lotStatusField + " = " + statusSelect,
        });

        // For initial state, we need to add this
        arcgisScene?.view.on("click", () => {
          layerView.filter = new FeatureFilter({
            where: undefined,
          });
          highlightSelect !== undefined
            ? highlightSelect.remove()
            : console.log("");
        });
      }); // End of view.whenLayerView
    });

    pieSeries.data.setAll(lotData);

    // Legend
    // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        scale: 1,
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
  }, [chartID, lotData]);

  useEffect(() => {
    pieSeriesRef.current?.data.setAll(lotData);
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
        TOTAL LOTS
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
            {thousands_separators(lotNumber[0])}
          </div>
          <img
            src="https://EijiGorilla.github.io/Symbols/Land_logo.png"
            alt="Land Logo"
            height={"45px"}
            width={"45px"}
            style={{ marginLeft: "290px", display: "flex", marginTop: "-50px" }}
          />
        </b>
      </CalciteLabel>

      <SuperUrgentSegmentedList />

      {/* As of date  */}
      <div
        style={{
          color: daysPass === true ? "red" : "gray",
          fontSize: "0.8rem",
          float: "right",
          marginRight: "5px",
          marginTop: "5px",
        }}
      >
        {!asOfDate ? "" : "As of " + asOfDate}
      </div>

      {/* Lot Chart */}
      <div
        id={chartID}
        style={{
          height: "50vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          marginTop: "8%",
          marginBottom: "10%",
        }}
      ></div>

      {/* Handed-Over */}
      <div
        style={{
          display: "flex",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "green",
            height: "0",
            marginTop: "13px",
            marginRight: "-10px",
          }}
        >
          <CalciteCheckbox
            name="handover-checkbox"
            label="VIEW"
            scale="l"
            onCalciteCheckboxChange={(event: any) =>
              setHandedOverCheckBox(handedOverCheckBox === false ? true : false)
            }
          ></CalciteCheckbox>
        </div>
        <dl style={{ alignItems: "center" }}>
          <dt style={{ color: primaryLabelColor, fontSize: "1.1rem" }}>
            Total Handed-Over
          </dt>
          <dd
            style={{
              color: valueLabelColor,
              fontSize: "1.7rem",
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
            }}
          >
            {handedOverNumber[0]}% ({thousands_separators(handedOverNumber[1])})
          </dd>
        </dl>
        <dl style={{ alignItems: "center" }}>
          <dt style={{ color: primaryLabelColor, fontSize: "1.1rem" }}>
            Handed-Over Area
          </dt>
          {/* #d3d3d3 */}
          <dd
            style={{
              color: valueLabelColor,
              fontSize: "1.7rem",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
              fontWeight: "bold",
            }}
          >
            {handedOverArea && thousands_separators(handedOverArea.toFixed(0))}
            <label style={{ fontWeight: "normal", fontSize: "1.3rem" }}>
              {" "}
              m
            </label>
            <label style={{ verticalAlign: "super", fontSize: "0.6rem" }}>
              2
            </label>
          </dd>
        </dl>
      </div>
    </>
  );
}; // End of lotChartgs

export default LotChart;

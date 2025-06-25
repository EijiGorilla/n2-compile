import { useRef, useState, useEffect, use } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { lastDateOfMonth, timeSeriesHandedOverChartData } from "../Query";
import { lotLayer } from "../layers";
import Query from "@arcgis/core/rest/support/Query";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import {
  cpField,
  lotHandedOverDateField,
  lotHandOverDateField,
  lotTargetActualField,
  querySuperUrgent,
  superurgent_items,
} from "../StatusUniqueValues";
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
const LotProgressChart = () => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const { contractpackages } = use(MyContext);
  const { superurgentswitch } = use(MyContext);

  const legendRef = useRef<unknown | any | undefined>({});
  const xAxisRef = useRef<unknown | any | undefined>({});
  const yAxisRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [lotProgressData, setLotProgressData] = useState([]);

  const chartID = "lot-progress";
  useEffect(() => {
    // generateLotProgress(municipal, barangay).then((result: any) => {
    //   setLotProgressData(result);
    // });
    timeSeriesHandedOverChartData(contractpackages, superurgentswitch).then(
      (result: any) => {
        setLotProgressData(result);
      }
    );
  }, [contractpackages, superurgentswitch]);

  useEffect(() => {
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
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingBottom: 35,
        layout: root.verticalLayout,
      })
    );
    chartRef.current = chart;

    let scrollbarY1 = am5xy.XYChartScrollbar.new(root, {
      orientation: "vertical",
      // height: 50,
      // width: 1,
    });

    scrollbarY1.startGrip.set("scale", 0.7);
    scrollbarY1.endGrip.set("scale", 0.7);

    chart.set("scrollbarY", scrollbarY1);
    let scrollbarY2 = chart.get("scrollbarY");
    scrollbarY2?.get("background")?.setAll({
      fill: am5.color("#ffffff"),
      fillOpacity: 0.2,
    });

    // Chart title
    chart.children.unshift(
      am5.Label.new(root, {
        text: "Monthly Progress & Target Schedule of Handed Over Lots",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        fill: am5.color("#ffffff"),
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 0,
        marginBottom: 10,
      })
    );

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "zoomX",
      })
    );
    cursor.lineY.set("visible", false);

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xRenderer = am5xy.AxisRendererX.new(root, {
      //minGridDistance: 60,
      strokeOpacity: 1,
      strokeWidth: 1,
      stroke: am5.color("#ffffff"),
    });
    var xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        // When you group data for series
        // Note you need to baseInterval timeUnit is 'day'
        // and groupIntervals timeUnit is 'month'
        maxDeviation: 0,
        groupData: true,
        baseInterval: {
          timeUnit: "day",
          count: 1,
        },
        // count:
        groupIntervals: [{ timeUnit: "month", count: 1 }],
        // categoryField: 'date',
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        // calculateTotals: true,
        min: 0,
        // max: 100,
        // numberFormat: "#'%'",
        strictMinMax: true,
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 60,
          strokeOpacity: 1,
          strokeWidth: 1,
          stroke: am5.color("#ffffff"),
        }),
      })
    );

    xAxis.get("renderer").labels.template.setAll({
      //oversizedBehavior: "wrap",
      textAlign: "center",
      fill: am5.color("#ffffff"),
      //maxWidth: 150,
      fontSize: 12,
    });

    yAxis.get("renderer").labels.template.setAll({
      //oversizedBehavior: "wrap",//
      textAlign: "center",
      fill: am5.color("#ffffff"),
      //maxWidth: 150,
      fontSize: 12,
    });
    xAxisRef.current = xAxis;
    yAxisRef.current = yAxis;

    // Add yaxix title
    yAxis.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        // text: 'No. of casted components',
        y: am5.p50,
        centerX: am5.p50,
        fill: am5.color("#ffffff"),
        fontSize: 11,
      })
    );

    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        centerY: am5.percent(50),
        x: am5.p50,
        y: am5.percent(108),
        marginTop: -20,
      })
    );
    legendRef.current = legend;

    legend.labels.template.setAll({
      oversizedBehavior: "truncate",
      fill: am5.color("#ffffff"),
      fontSize: 17,
      scale: 0.7,
      //textDecoration: "underline"
      //width: am5.percent(200)
      //fontWeight: "300"
    });

    // check this;
    // newDataItem = new DataItem(series, dataContext, series._makeDataItem(dataContext));
    // dataItem is of dataItems
    // dataContext: dataItem.dataContext

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name: any, fieldName: any, color: any) {
      var series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          stacked: true,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          valueXField: "date",
          // valueYShow: 'valueYTotalPercent',
          categoryXField: "date",
          fill: color,
          stroke: color,
          // valueYGrouped: 'sum',
        })
      );

      // select chart series and filter
      var highlightSelect: any;
      series.columns.template.events.on("click", (ev) => {
        // const qExpression =
        const select: any = ev.target.dataItem?.dataContext;
        const raw_date = new Date(select?.date);
        const last_date = lastDateOfMonth(new Date(raw_date));
        const qDate =
          fieldName === "target"
            ? `${lotHandOverDateField} <= date'` + last_date + "'"
            : `${lotHandedOverDateField} <= date'` + last_date + "'";
        const status = fieldName === "target" ? 1 : 2;

        const qSelected = `${lotTargetActualField} = ` + status;
        const queryDefault = "1=1";
        const queryContractp = `${cpField} = '` + contractpackages + "'";
        const querySuperUrgentCp = querySuperUrgent + " AND " + queryContractp;

        let layerViewFilter: any;

        var query = lotLayer.createQuery();

        if (superurgentswitch === superurgent_items[0]) {
          if (contractpackages === "All") {
            query.where = queryDefault + " AND " + qSelected + " AND " + qDate;
            layerViewFilter =
              queryDefault + " AND " + qSelected + " AND " + qDate;
          } else {
            query.where =
              queryContractp + " AND " + qSelected + " AND " + qDate;
            layerViewFilter =
              queryContractp + " AND " + qSelected + " AND " + qDate;
          }
        } else if (superurgentswitch === superurgent_items[1]) {
          if (contractpackages === "All") {
            query.where =
              querySuperUrgent + " AND " + qSelected + " AND " + qDate;
            layerViewFilter =
              querySuperUrgent + " AND " + qSelected + " AND " + qDate;
          } else {
            query.where =
              querySuperUrgentCp + " AND " + qSelected + " AND " + qDate;
            layerViewFilter =
              querySuperUrgentCp + " AND " + qSelected + " AND " + qDate;
          }
        }

        arcgisScene?.whenLayerView(lotLayer).then((layerView: any) => {
          lotLayer.queryFeatures(query).then((results: any) => {
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
          });
          layerView.filter = new FeatureFilter({
            where: layerViewFilter,
          });
        }); // End of whenLayerView
      });

      series.columns.template.setAll({
        tooltipText:
          '{name}: {valueY} ({valueYTotalPercent.formatNumber("#.#")}%)',
        tooltipY: am5.percent(10),
      });
      series.data.setAll(lotProgressData);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
          }),
        });
      });

      legend.data.push(series);
    }

    makeSeries("Actual", "actual", am5.color("#0096FF"));
    makeSeries("Target", "target", am5.color("#FF5733"));

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [chartID, lotProgressData]);

  return (
    <>
      <div
        id={chartID}
        style={{
          height: "40vh",
          width: "70%",
          backgroundColor: "#2b2b2b",
          color: "white",
          position: "fixed",
          zIndex: 10,
          bottom: 0,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {" "}
        <b
          style={{
            fontSize: "60px",
            opacity: "0.4",
            zIndex: "12",
            color: "gray",
            position: "fixed",
            bottom: "130px",
            left: "100px",
            transform: "rotate(10deg)",
          }}
        >
          UNDER DEVELOPMENT
        </b>
      </div>
    </>
  );
};

export default LotProgressChart;

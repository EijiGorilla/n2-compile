import { useEffect, useRef, useState, use } from "react";
import {
  utilityPointLayer1,
  utilityLineLayer1,
  utilityPointLayer,
  utilityLineLayer,
} from "../layers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import Query from "@arcgis/core/rest/support/Query";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import "@esri/calcite-components/dist/components/calcite-label";
import { CalciteLabel } from "@esri/calcite-components-react";
import "../App.css";
import {
  dateUpdate,
  generateUtilityLineData,
  generateUtilityNumbers,
  generateUtilityPointData,
  thousands_separators,
  utilityTypeChart,
} from "../Query";
import {
  cutoff_days,
  primaryLabelColor,
  updatedDateCategoryNames,
  valueLabelColor,
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

// Draw chart
const UtilityChart = () => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const { contractpackages } = use(MyContext);

  // 0. Updated date
  const [asOfDate, setAsOfDate] = useState<undefined | any | unknown>(null);
  const [daysPass, setDaysPass] = useState<boolean>(false);
  useEffect(() => {
    dateUpdate(updatedDateCategoryNames[3]).then((response: any) => {
      setAsOfDate(response[0][0]);
      setDaysPass(response[0][1] >= cutoff_days ? true : false);
    });
  }, []);

  // utility point
  const chartRef = useRef<unknown | any | undefined>({});
  const [pointChartData, setPointChartData] = useState([]);
  const chartID = "utility-point-bar";

  // utility line
  const chartRef_line = useRef<unknown | any | undefined>({});
  const [lineChartData, setLineChartData] = useState([]);
  const chartID_line = "utility-line-bar";
  //
  const [progress, setProgress] = useState([]);

  const defaultQuery = "1=1";
  const qContractp = "CP = '" + contractpackages + "'";

  if (contractpackages === "All") {
    utilityPointLayer.definitionExpression = defaultQuery;
    utilityPointLayer1.definitionExpression = defaultQuery;
    utilityLineLayer.definitionExpression = defaultQuery;
    utilityLineLayer1.definitionExpression = defaultQuery;
  } else {
    utilityPointLayer.definitionExpression = qContractp;
    utilityPointLayer1.definitionExpression = qContractp;
    utilityLineLayer.definitionExpression = qContractp;
    utilityLineLayer1.definitionExpression = qContractp;
  }

  useEffect(() => {
    generateUtilityPointData().then((response: any) => {
      setPointChartData(response);
    });

    generateUtilityLineData().then((response: any) => {
      setLineChartData(response);
    });

    generateUtilityNumbers(contractpackages).then((response: any) => {
      setProgress(response);
    });
  }, [contractpackages]);

  // Define parameters
  const marginTop = 0;
  const marginLeft = 0;
  const marginRight = 0;
  const marginBottom = 0;
  const paddingTop = 10;
  const paddingLeft = 5;
  const paddingRight = 5;
  const paddingBottom = 0;

  const xAxisNumberFormat = "#'%'";
  const seriesBulletLabelFontSize = "1vw";

  // axis label
  const yAxisLabelFontSize = "0.8vw";
  const xAxisLabelFontSize = "0.8vw";
  const legendFontSize = "0.8vw";

  // 1.1. Point
  const chartIconWidth = 35;
  const chartIconHeight = 35;
  const chartIconPositionX = -21;
  const chartPaddingRightIconLabel = 45;

  const chartSeriesFillColorComp = "#0070ff";
  const chartSeriesFillColorIncomp = "#000000";
  const chartBorderLineColor = "#00c5ff";
  const chartBorderLineWidth = 0.4;

  // Utility point
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

    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
        marginTop: marginTop,
        marginLeft: marginLeft,
        marginRight: marginRight,
        marginBottom: marginBottom,
        paddingTop: paddingTop,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        paddingBottom: paddingBottom,
        scale: 1,
        height: am5.percent(100),
      })
    );
    chartRef.current = chart;

    var yRenderer = am5xy.AxisRendererY.new(root, {
      inversed: true,
    });
    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: yRenderer,
        bullet: function (root, axis, dataItem: any) {
          return am5xy.AxisBullet.new(root, {
            location: 0.5,
            sprite: am5.Picture.new(root, {
              width: chartIconWidth,
              height: chartIconHeight,
              centerY: am5.p50,
              centerX: am5.p50,
              x: chartIconPositionX,
              src: dataItem.dataContext.icon,
            }),
          });
        },
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    yRenderer.labels.template.setAll({
      paddingRight: chartPaddingRightIconLabel,
    });

    yRenderer.grid.template.setAll({
      location: 1,
    });

    // Label properties Y axis
    yAxis.get("renderer").labels.template.setAll({
      oversizedBehavior: "wrap",
      textAlign: "center",
      fill: am5.color("#ffffff"),
      //maxWidth: 150,
      fontSize: yAxisLabelFontSize,
    });
    yAxis.data.setAll(pointChartData);

    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 100,
        strictMinMax: true,
        numberFormat: xAxisNumberFormat,
        calculateTotals: true,
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0,
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
      fontSize: xAxisLabelFontSize,
    });

    // var legend = chart.children.push(
    //   am5.Legend.new(root, {
    //     centerX: am5.p50,
    //     centerY: am5.percent(50),
    //     x: am5.percent(60),
    //     y: am5.percent(97),
    //     marginTop: 20,
    //   }),
    // );
    // legendRef.current = legend;

    // legend.labels.template.setAll({
    //   oversizedBehavior: 'truncate',
    //   fill: am5.color('#ffffff'),
    //   fontSize: legendFontSize,
    //   scale: 1.2,
    // });

    function makeSeries(name: any, fieldName: any) {
      var series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          stacked: true,
          xAxis: xAxis,
          yAxis: yAxis,
          baseAxis: yAxis,
          valueXField: fieldName,
          valueXShow: "valueXTotalPercent",
          categoryYField: "category",
          fill:
            fieldName === "incomp"
              ? am5.color(chartSeriesFillColorIncomp)
              : am5.color(chartSeriesFillColorComp),
          stroke: am5.color(chartBorderLineColor),
        })
      );

      series.columns.template.setAll({
        tooltipText: "{name}: {valueX}", // "{categoryY}: {valueX}",
        tooltipY: am5.percent(90),
        //fill: am5.color("#ffffff")
        // 100% transparent for incomplete
        fillOpacity: fieldName === "incomp" ? 0 : 1,
        strokeWidth: chartBorderLineWidth,
        //strokeOpacity: 0,
      });
      series.data.setAll(pointChartData);

      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text:
              fieldName === 0 ? "" : "{valueXTotalPercent.formatNumber('#.')}%", //"{valueX}",
            fill: root.interfaceColors.get("alternativeText"),
            opacity: fieldName === "incomp" ? 0 : 1,
            fontSize: seriesBulletLabelFontSize,
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
          }),
        });
      });

      // Click event
      series.columns.template.events.on("click", (ev) => {
        const selected: any = ev.target.dataItem?.dataContext;
        const categorySelect: string = selected.category;
        const find = utilityTypeChart.find(
          (emp: any) => emp.category === categorySelect
        );
        const typeSelect = find?.value;

        const selectedStatus: number | null = fieldName === "incomp" ? 0 : 1;

        const defaultExpression = "1=1";
        const sqlExpression =
          "CP = '" +
          contractpackages +
          "'" +
          " AND " +
          "UtilType = " +
          typeSelect +
          " AND " +
          "Status = " +
          selectedStatus;
        // Define Query
        var query = utilityPointLayer.createQuery();
        query.where =
          contractpackages === "All" ? defaultExpression : sqlExpression;

        let highlightSelect: any;
        arcgisScene?.whenLayerView(utilityPointLayer).then((layerView: any) => {
          utilityPointLayer.queryFeatures(query).then((results: any) => {
            const lengths = results.features;
            const rows = lengths.length;

            let objID = [];
            for (var i = 0; i < rows; i++) {
              var obj = results.features[i].attributes.OBJECTID;
              objID.push(obj);
            }

            var queryExt = new Query({
              objectIds: objID,
            });

            utilityPointLayer.queryExtent(queryExt).then((result: any) => {
              if (result.extent) {
                arcgisScene?.view.goTo(result.extent);
              }
            });

            if (highlightSelect) {
              highlightSelect.remove();
            }
            highlightSelect = layerView.highlight(objID);

            arcgisScene?.view.on("click", () => {
              layerView.filter = new FeatureFilter({
                where: undefined,
              });
              highlightSelect.remove();
            });
          });
          layerView.filter = new FeatureFilter({
            where:
              contractpackages === "All" ? defaultExpression : sqlExpression,
          });
        });

        var query1 = utilityPointLayer.createQuery();
        query1.where =
          contractpackages === "All" ? defaultExpression : sqlExpression;

        arcgisScene?.view
          .whenLayerView(utilityPointLayer1)
          .then((layerView: any) => {
            utilityPointLayer1.queryFeatures(query1).then((results: any) => {
              const lengths = results.features;
              const rows = lengths.length;

              let objID = [];
              for (var i = 0; i < rows; i++) {
                var obj = results.features[i].attributes.OBJECTID;
                objID.push(obj);
              }

              var queryExt = new Query({
                objectIds: objID,
              });

              utilityPointLayer1.queryExtent(queryExt).then((result: any) => {
                if (result.extent) {
                  arcgisScene?.view.goTo(result.extent);
                }
              });

              if (highlightSelect) {
                highlightSelect.remove();
              }
              highlightSelect = layerView.highlight(objID);

              arcgisScene?.view.on("click", () => {
                layerView.filter = new FeatureFilter({
                  where: undefined,
                });
                highlightSelect.remove();
              });
            });
            layerView.filter = new FeatureFilter({
              where:
                contractpackages === "All" ? defaultExpression : sqlExpression,
            });
          });

        // Point + Line
      });

      // legend.data.push(series);
    }
    makeSeries("Complete", "comp");
    makeSeries("Incomplete", "incomp");
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  });

  // utility line
  useEffect(() => {
    maybeDisposeRoot(chartID_line);

    var root2 = am5.Root.new(chartID_line);
    root2.container.children.clear();
    root2._logo?.dispose();

    // Set themesf
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root2.setThemes([
      am5themes_Animated.new(root2),
      am5themes_Responsive.new(root2),
    ]);

    var chart = root2.container.children.push(
      am5xy.XYChart.new(root2, {
        panX: false,
        panY: false,
        layout: root2.verticalLayout,
        marginTop: marginTop,
        marginLeft: marginLeft,
        marginRight: marginRight,
        marginBottom: marginBottom,
        paddingTop: paddingTop,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        paddingBottom: paddingBottom,
        scale: 1,
        height: am5.percent(100),
      })
    );
    chartRef_line.current = chart;

    var yRenderer = am5xy.AxisRendererY.new(root2, {
      inversed: true,
    });
    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root2, {
        categoryField: "category",
        renderer: yRenderer,
        bullet: function (root2, axis, dataItem: any) {
          return am5xy.AxisBullet.new(root2, {
            location: 0.5,
            sprite: am5.Picture.new(root2, {
              width: chartIconWidth,
              height: chartIconHeight,
              centerY: am5.p50,
              centerX: am5.p50,
              x: chartIconPositionX,
              src: dataItem.dataContext.icon,
            }),
          });
        },
        tooltip: am5.Tooltip.new(root2, {}),
      })
    );

    yRenderer.labels.template.setAll({
      paddingRight: chartPaddingRightIconLabel,
    });

    yRenderer.grid.template.setAll({
      location: 1,
    });

    // Label properties Y axis
    yAxis.get("renderer").labels.template.setAll({
      oversizedBehavior: "wrap",
      textAlign: "center",
      fill: am5.color("#ffffff"),
      //maxWidth: 150,
      fontSize: yAxisLabelFontSize,
    });
    yAxis.data.setAll(lineChartData);

    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root2, {
        min: 0,
        max: 100,
        strictMinMax: true,
        numberFormat: xAxisNumberFormat,
        calculateTotals: true,
        renderer: am5xy.AxisRendererX.new(root2, {
          strokeOpacity: 0,
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
      fontSize: xAxisLabelFontSize,
    });

    // var legend = chart.children.push(
    //   am5.Legend.new(root, {
    //     centerX: am5.p50,
    //     centerY: am5.percent(50),
    //     x: am5.percent(60),
    //     y: am5.percent(97),
    //     marginTop: 20,
    //   }),
    // );
    // legendRef.current = legend;

    // legend.labels.template.setAll({
    //   oversizedBehavior: 'truncate',
    //   fill: am5.color('#ffffff'),
    //   fontSize: legendFontSize,
    //   scale: 1.2,
    // });

    function makeSeries(name: any, fieldName: any) {
      var series = chart.series.push(
        am5xy.ColumnSeries.new(root2, {
          name: name,
          stacked: true,
          xAxis: xAxis,
          yAxis: yAxis,
          baseAxis: yAxis,
          valueXField: fieldName,
          valueXShow: "valueXTotalPercent",
          categoryYField: "category",
          fill:
            fieldName === "incomp"
              ? am5.color(chartSeriesFillColorIncomp)
              : am5.color(chartSeriesFillColorComp),
          stroke: am5.color(chartBorderLineColor),
        })
      );

      series.columns.template.setAll({
        tooltipText: "{name}: {valueX}", // "{categoryY}: {valueX}",
        tooltipY: am5.percent(90),
        //fill: am5.color("#ffffff")
        // 100% transparent for incomplete
        fillOpacity: fieldName === "incomp" ? 0 : 1,
        strokeWidth: chartBorderLineWidth,
        //strokeOpacity: 0,
      });
      series.data.setAll(lineChartData);

      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root2, {
          sprite: am5.Label.new(root2, {
            text:
              fieldName === 0 ? "" : "{valueXTotalPercent.formatNumber('#.')}%", //"{valueX}",
            fill: root2.interfaceColors.get("alternativeText"),
            opacity: fieldName === "incomp" ? 0 : 1,
            fontSize: seriesBulletLabelFontSize,
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
          }),
        });
      });

      // Click event
      series.columns.template.events.on("click", (ev) => {
        const selected: any = ev.target.dataItem?.dataContext;
        const categorySelect: string = selected.category;
        const find = utilityTypeChart.find(
          (emp: any) => emp.category === categorySelect
        );
        const typeSelect = find?.value;

        const selectedStatus: number | null = fieldName === "incomp" ? 0 : 1;

        const defaultExpression = "1=1";
        const sqlExpression =
          "CP = '" +
          contractpackages +
          "'" +
          " AND " +
          "UtilType = " +
          typeSelect +
          " AND " +
          "Status = " +
          selectedStatus;
        // Define Query
        var query = utilityLineLayer.createQuery();
        query.where =
          contractpackages === "All" ? defaultExpression : sqlExpression;

        let highlightSelect: any;
        arcgisScene?.whenLayerView(utilityLineLayer).then((layerView: any) => {
          utilityLineLayer.queryFeatures(query).then((results: any) => {
            const lengths = results.features;
            const rows = lengths.length;

            let objID = [];
            for (var i = 0; i < rows; i++) {
              var obj = results.features[i].attributes.OBJECTID;
              objID.push(obj);
            }

            var queryExt = new Query({
              objectIds: objID,
            });

            utilityLineLayer.queryExtent(queryExt).then((result: any) => {
              if (result.extent) {
                arcgisScene?.view.goTo(result.extent);
              }
            });

            if (highlightSelect) {
              highlightSelect.remove();
            }
            highlightSelect = layerView.highlight(objID);

            arcgisScene?.view.on("click", () => {
              layerView.filter = new FeatureFilter({
                where: undefined,
              });
              highlightSelect.remove();
            });
          });
          layerView.filter = new FeatureFilter({
            where:
              contractpackages === "All" ? defaultExpression : sqlExpression,
          });
        });

        var query1 = utilityLineLayer.createQuery();
        query1.where =
          contractpackages === "All" ? defaultExpression : sqlExpression;

        arcgisScene?.view
          .whenLayerView(utilityLineLayer1)
          .then((layerView: any) => {
            utilityLineLayer1.queryFeatures(query1).then((results: any) => {
              const lengths = results.features;
              const rows = lengths.length;

              let objID = [];
              for (var i = 0; i < rows; i++) {
                var obj = results.features[i].attributes.OBJECTID;
                objID.push(obj);
              }

              var queryExt = new Query({
                objectIds: objID,
              });

              utilityLineLayer1.queryExtent(queryExt).then((result: any) => {
                if (result.extent) {
                  arcgisScene?.view.goTo(result.extent);
                }
              });

              if (highlightSelect) {
                highlightSelect.remove();
              }
              highlightSelect = layerView.highlight(objID);

              arcgisScene?.view.on("click", () => {
                layerView.filter = new FeatureFilter({
                  where: undefined,
                });
                highlightSelect.remove();
              });
            });
            layerView.filter = new FeatureFilter({
              where:
                contractpackages === "All" ? defaultExpression : sqlExpression,
            });
          });

        // Point + Line
      });

      // legend.data.push(series);
    }
    makeSeries("Complete", "comp");
    makeSeries("Incomplete", "incomp");
    chart.appear(1000, 100);

    return () => {
      root2.dispose();
    };
  });

  return (
    <div>
      <div
        style={{
          color: primaryLabelColor,
          fontSize: "1.2rem",
          marginLeft: "13px",
          marginTop: "10px",
        }}
      >
        TOTAL PROGRESS
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
            <b className="totalLotsNumber" style={{ color: valueLabelColor }}>
              {thousands_separators(progress[1])} %{" "}
              <div className="totalLotsNumber2">
                ({thousands_separators(progress[0])})
              </div>
            </b>
          </div>
          <img
            src="https://EijiGorilla.github.io/Symbols/Utility_Logo.png"
            alt="Land Logo"
            height={"75px"}
            width={"75px"}
            style={{ marginLeft: "290px", display: "flex", marginTop: "-90px" }}
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

      <div id="utilityPointChartTitle" style={{ marginTop: "10px" }}>
        POINT FEATURE
      </div>
      <div
        id={chartID}
        style={{
          width: "23vw",
          height: "33vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          marginRight: "10px",
        }}
      ></div>
      <div id="utilityLineChartTitle">LINE FEATURE</div>
      <div
        id={chartID_line}
        style={{
          width: "23vw",
          height: "33vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          marginRight: "10px",
        }}
      ></div>
    </div>
  );
};

export default UtilityChart;

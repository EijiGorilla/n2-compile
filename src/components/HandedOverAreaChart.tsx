import { useRef, useState, useEffect, memo } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Responsive from '@amcharts/amcharts5/themes/Responsive';
import { generateHandedOverAreaData } from '../Query';

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

const HandedOverAreaChart = memo(() => {
  const chartRef = useRef<unknown | any | undefined>({});
  const [lotHandedOverAreaData, setLotHandedOverAreaData] = useState([]);

  const chartID = 'lot-handedover';
  useEffect(() => {
    generateHandedOverAreaData().then((result: any) => {
      setLotHandedOverAreaData(result);
    });
  }, []);

  useEffect(() => {
    maybeDisposeRoot(chartID);
    var root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    root.setThemes([am5themes_Animated.new(root), am5themes_Responsive.new(root)]);

    // Create chart
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'panY',
        wheelY: 'zoomY',
        layout: root.verticalLayout,
      }),
    );
    chartRef.current = chart;

    chart.children.unshift(
      am5.Label.new(root, {
        text: 'Handed-Over Area (m2)',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        fill: am5.color('#ffffff'),
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 0,
        paddingBottom: 0,
      }),
    );

    // Create axes
    var yRenderer = am5xy.AxisRendererY.new(root, {
      strokeOpacity: 1,
      strokeWidth: 1,
      stroke: am5.color('#ffffff'),
    });

    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'category',
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      }),
    );

    // Label properties Y axis
    yAxis.get('renderer').labels.template.setAll({
      //oversizedBehavior: "wrap",
      textAlign: 'center',
      fill: am5.color('#ffffff'),
      //maxWidth: 150,
      fontSize: 12,
    });

    yRenderer.grid.template.setAll({
      location: 1,
    });
    yAxis.data.setAll(lotHandedOverAreaData);

    // Set xaxis
    var xRenderer = am5xy.AxisRendererX.new(root, {
      strokeOpacity: 1,
      strokeWidth: 1,
      stroke: am5.color('#ffffff'),
    });

    // Remove xaxis labels
    xRenderer.labels.template.set('visible', false);

    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 100,
        strictMinMax: true,
        calculateTotals: true,
        renderer: xRenderer,
      }),
    );

    function makeSeries(name: any, fieldName: any) {
      var series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          stacked: true,
          xAxis: xAxis,
          yAxis: yAxis,
          baseAxis: yAxis,
          valueXShow: 'valueXTotalPercent',
          valueXField: fieldName,
          categoryYField: 'category',
          fill: am5.color('#0070ff'),
        }),
      );

      series.columns.template.setAll({
        //tooltipText: "{name}, {categoryY}: {valueX}%",
        //tooltipY: am5.percent(90)
      });
      series.data.setAll(lotHandedOverAreaData);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: '{valueX}%',
            fill: am5.color('#ffffff'), //root6.interfaceColors.get("alternativeText"),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
            fontSize: 12,
          }),
        });
      });
    }
    makeSeries('Value', 'value');
    chart.appear(1000, 100);
    return () => {
      root.dispose();
    };
  }, [chartID, lotHandedOverAreaData]);

  return (
    <>
      <div
        id={chartID}
        style={{
          height: '35vh',
          width: '30%',
          backgroundColor: '#2b2b2b',
          color: 'white',
          position: 'absolute',
          zIndex: 99,
          bottom: 10,
          marginLeft: '1vw',
          marginRight: 'auto',
        }}
      ></div>
    </>
  );
});

export default HandedOverAreaChart;

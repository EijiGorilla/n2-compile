import {
  buildingLayer,
  colorsCompen,
  colorsCutting,
  columnsLayer,
  dateTable,
  floorsLayer,
  lotLayer,
  lotStatusArray,
  ngcp_tagged_structureLayer,
  nloLayer,
  statusLotColor,
  stColumnLayer,
  stFoundationLayer,
  stFramingLayer,
  structureLayer,
  treeCompensationLayer,
  treeCuttingLayer,
  utilityLineLayer,
  utilityPointLayer,
  viaductLayer,
  wallsLayer,
} from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import * as am5 from "@amcharts/amcharts5";
import Query from "@arcgis/core/rest/support/Query";
import Collection from "@arcgis/core/core/Collection";
import ActionButton from "@arcgis/core/support/actions/ActionButton";
import {
  cpField,
  handedOverLotField,
  lotHandedOverAreaField,
  lotIdField,
  lotTargetActualDateField,
  querySuperUrgent,
  statusStructureLabel,
  statusStructureQuery,
  structureStatusField,
  superurgent_items,
} from "./StatusUniqueValues";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;

export const contractPackage = ["All", "N-01", "N-02", "N-03", "N-04"];

// get last date of month
export function lastDateOfMonth(date: Date) {
  const old_date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const year = old_date.getFullYear();
  const month = old_date.getMonth() + 1;
  const day = old_date.getDate();
  const final_date = `${year}-${month}-${day}`;

  return final_date;
}

// Updat date
export async function dateUpdate(category: any) {
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const query = dateTable.createQuery();
  query.where = "project = 'N2'" + " AND " + "category = '" + category + "'";

  return dateTable.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const dates = stats.map((result: any) => {
      // get today and date recorded in the table
      const today = new Date();
      const date = new Date(result.attributes.date);

      // Calculate the number of days passed since the last update
      const time_passed = today.getTime() - date.getTime();
      const days_passed = Math.round(time_passed / (1000 * 3600 * 24));
      const year = date.getFullYear();
      const month = monthList[date.getMonth()];
      const day = date.getDate();
      const final = year < 1990 ? "" : `${month} ${day}, ${year}`;
      return [final, days_passed];
    });
    return dates;
  });
}

// For Lot Pie Chart
export const lotStatusField = "StatusLA";
export const statusLotChart = lotStatusArray.map((status: any, index: any) => {
  return Object.assign({
    category: status,
    value: index + 1,
  });
});

export async function generateLotData() {
  var total_count = new StatisticDefinition({
    onStatisticField: lotStatusField,
    outStatisticFieldName: "total_count",
    statisticType: "count",
  });

  var query = lotLayer.createQuery();

  query.outFields = [lotStatusField];
  query.outStatistics = [total_count];
  query.orderByFields = [lotStatusField];
  query.groupByFieldsForStatistics = [lotStatusField];

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features;
    const data = stats.map((result: any, index: any) => {
      const attributes = result.attributes;
      const status = attributes.StatusLA;
      const count = attributes.total_count;
      return Object.assign({
        category: lotStatusArray[status - 1],
        value: count,
      });
    });

    const compile: any = [];
    lotStatusArray.map((status: any, index: any) => {
      const find = data.find((emp: any) => emp.category === status);
      const value = find === undefined ? 0 : find?.value;
      const object = {
        category: status,
        value: value,
        sliceSettings: {
          fill: am5.color(statusLotColor[index]),
        },
      };
      compile.push(object);
    });
    return compile;
  });
}

export async function generateLotNumber() {
  var total_lot_number = new StatisticDefinition({
    onStatisticField: "LotID",
    outStatisticFieldName: "total_lot_number",
    statisticType: "count",
  });

  var total_lot_pie = new StatisticDefinition({
    onStatisticField: "CASE WHEN StatusLA >= 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_lot_pie",
    statisticType: "sum",
  });

  var query = lotLayer.createQuery();
  query.outStatistics = [total_lot_number, total_lot_pie];
  query.returnGeometry = true;

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const totalLotNumber = stats.total_lot_number;
    const totalLotPie = stats.total_lot_pie;
    return [totalLotNumber, totalLotPie];
  });
}

// Handed Over
export async function generateHandedOverLotsNumber(
  superurgent: any,
  contractcp: any
) {
  const queryDefault = "1=1";
  const queryContractp = `${cpField} = '` + contractcp + "'";
  const querySuperUrgentCp = querySuperUrgent + " AND " + queryContractp;
  const lotIdNotNull = `${lotIdField} IS NOT NULL`;

  const onStatisticsFieldValue: string =
    "CASE WHEN " + handedOverLotField + " = 1 THEN 1 ELSE 0 END";

  var total_handedover_lot = new StatisticDefinition({
    onStatisticField: onStatisticsFieldValue,
    outStatisticFieldName: "total_handedover_lot",
    statisticType: "sum",
  });

  var total_lot_N = new StatisticDefinition({
    onStatisticField: lotIdField,
    outStatisticFieldName: "total_lot_N",
    statisticType: "count",
  });

  var query = lotLayer.createQuery();

  if (superurgent === superurgent_items[0]) {
    if (contractcp === "All") {
      query.where = lotIdNotNull;
    } else {
      query.where = lotIdNotNull + " AND " + queryContractp;
    }
  } else if (superurgent === superurgent_items[1]) {
    // ON
    if (contractcp === "All") {
      query.where = lotIdNotNull + " AND " + querySuperUrgent;
    } else {
      query.where = lotIdNotNull + " AND " + querySuperUrgentCp;
    }
  }

  // if (!contractcp || contractcp === 'All') {
  //   query.where = statusQuery;
  // } else if (contractcp) {
  //   query.where = statusQuery + ' AND ' + queryCP;
  // }

  query.outStatistics = [total_handedover_lot, total_lot_N];
  // query.returnGeometry = true;

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const handedover = stats.total_handedover_lot;
    const totaln = stats.total_lot_N;
    const percent = ((handedover / totaln) * 100).toFixed(0);
    return [percent, handedover];
  });
}

export async function generateHandedOverArea(
  superurgent: any,
  contractcp: any
) {
  // Query
  const queryContractp = `${cpField} = '` + contractcp + "'";
  const querySuperUrgentCp = querySuperUrgent + " AND " + queryContractp;
  const lotIdNotNull = `${lotIdField} IS NOT NULL`;

  var handed_over_area = new StatisticDefinition({
    onStatisticField: lotHandedOverAreaField,
    outStatisticFieldName: "handed_over_area",
    statisticType: "sum",
  });

  var query = lotLayer.createQuery();
  query.outStatistics = [handed_over_area];

  if (superurgent === superurgent_items[0]) {
    if (contractcp === "All") {
      query.where = lotIdNotNull;
    } else {
      query.where = lotIdNotNull + " AND " + queryContractp;
    }
  } else if (superurgent === superurgent_items[1]) {
    // ON
    if (contractcp === "All") {
      query.where = lotIdNotNull + " AND " + querySuperUrgent;
    } else {
      query.where = lotIdNotNull + " AND " + querySuperUrgentCp;
    }
  }

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const value = stats.handed_over_area;
    return value;
  });
}

// For monthly progress chart of lot
export async function generateLotProgress(contractp: any) {
  var total_count_lot = new StatisticDefinition({
    onStatisticField: "HandedOverDate",
    outStatisticFieldName: "total_count_lot",
    statisticType: "count",
  });

  var query = lotLayer.createQuery();
  query.outStatistics = [total_count_lot];

  const queryDefault = "1=1";
  const queryContractp = "CP = '" + contractp + "'";
  const qDate = "HandedOverDate IS NOT NULL";

  if (contractp === "All") {
    query.where = queryDefault + " AND " + qDate;
    lotLayer.definitionExpression = queryDefault + " AND " + qDate;
  } else {
    query.where = queryContractp + " AND " + qDate;
    lotLayer.definitionExpression = queryContractp + " AND " + qDate;
  }

  query.outFields = ["HandedOverDate"];
  query.orderByFields = ["HandedOverDate"];
  query.groupByFieldsForStatistics = ["HandedOverDate"];

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features;
    const data = stats.map((result: any, index: any) => {
      const attributes = result.attributes;
      const date = attributes.HandedOverDate;

      const total_handedover = attributes.total_count_lot;

      // compile in object array
      return Object.assign({
        date: date,
        value: total_handedover,
      });
    });

    return data;
  });
}

export async function generateHandedOverAreaData() {
  var total_affected_area = new StatisticDefinition({
    onStatisticField: "AffectedArea",
    outStatisticFieldName: "total_affected_area",
    statisticType: "sum",
  });

  var total_handedover_area = new StatisticDefinition({
    onStatisticField: "HandedOverArea",
    outStatisticFieldName: "total_handedover_area",
    statisticType: "sum",
  });

  var query = lotLayer.createQuery();
  query.where = "CP IS NOT NULL";
  query.outStatistics = [total_affected_area, total_handedover_area];
  query.orderByFields = ["CP"];
  query.returnGeometry = true;
  query.groupByFieldsForStatistics = ["CP"];

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features;
    const data = stats.map((result: any, index: any) => {
      const attributes = result.attributes;
      const affected = attributes.total_affected_area;
      const handedOver = attributes.total_handedover_area;
      const cp = attributes.CP;

      const percent = ((handedOver / affected) * 100).toFixed(0);

      return Object.assign(
        {},
        {
          category: cp,
          value: percent,
        }
      );
    });

    return data;
  });
}

export async function timeSeriesHandedOverChartData(
  contractp: any,
  superurgent: any
) {
  var total_target = new StatisticDefinition({
    onStatisticField: "CASE WHEN TargetActual = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_target",
    statisticType: "sum",
  });

  var total_actual = new StatisticDefinition({
    // means handed over
    onStatisticField: "CASE WHEN TargetActual = 2 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_actual",
    statisticType: "sum",
  });

  const query = lotLayer.createQuery();
  query.outStatistics = [total_target, total_actual];
  // eslint-disable-next-line no-useless-concat
  const queryDefault = "1=1";
  const queryContractp = `${cpField} = '` + contractp + "'";
  const querySuperUrgentCp = querySuperUrgent + " AND " + queryContractp;
  const queryHandedOverHandOverDate = lotTargetActualDateField + " IS NOT NULL";

  if (superurgent === superurgent_items[0]) {
    if (contractp === "All") {
      query.where = queryDefault + " AND " + queryHandedOverHandOverDate;
      lotLayer.definitionExpression =
        queryDefault + " AND " + queryHandedOverHandOverDate;
    } else {
      query.where = queryContractp + " AND " + queryHandedOverHandOverDate;
      lotLayer.definitionExpression =
        queryContractp + " AND " + queryHandedOverHandOverDate;
    }
  } else if (superurgent === superurgent_items[1]) {
    if (contractp === "All") {
      console.log("test");
      query.where = querySuperUrgent + " AND " + queryHandedOverHandOverDate;
      lotLayer.definitionExpression =
        querySuperUrgent + " AND " + queryHandedOverHandOverDate;
    } else {
      query.where = querySuperUrgentCp + " AND " + queryHandedOverHandOverDate;
      lotLayer.definitionExpression =
        querySuperUrgentCp + " AND " + queryHandedOverHandOverDate;
    }
  }

  query.outFields = [lotTargetActualDateField];
  query.orderByFields = [lotTargetActualDateField];
  query.groupByFieldsForStatistics = [lotTargetActualDateField];

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features;

    const data = stats.map((result: any, index: any) => {
      const attributes = result.attributes;
      const date = attributes[lotTargetActualDateField];
      const targetCount = attributes.total_target;
      const actualCount = attributes.total_actual;
      return Object.assign({
        date,
        target: targetCount,
        actual: actualCount,
      });
    });
    var sum_target: any = 0;
    var sum_actual: any = 0;

    const data2 = data.map((result: any, index: any) => {
      const date = result.date;
      const v_target = result.target;
      const v_actual = result.actual;
      sum_target += v_target;
      sum_actual += v_actual;
      return Object.assign({
        date,
        target: sum_target,
        actual: sum_actual,
      });
    });
    return data2;
  });
}

// Structure
const statusStructure = [
  "Dismantling/Clearing",
  "Paid",
  "For Payment Processing",
  "For Legal Pass",
  "For Appraisal/Offer to Compensate",
  "LBP Account Opening",
];

export const statusStructureChart = [
  {
    category: statusStructure[0],
    value: 1,
  },
  {
    category: statusStructure[1],
    value: 2,
  },
  {
    category: statusStructure[2],
    value: 3,
  },
  {
    category: statusStructure[3],
    value: 4,
  },
  {
    category: statusStructure[4],
    value: 5,
  },
  {
    category: statusStructure[5],
    value: 6,
  },
];

export async function generateStructureData(contractcp: any) {
  var total_count = new StatisticDefinition({
    onStatisticField: structureStatusField,
    outStatisticFieldName: "total_count",
    statisticType: "count",
  });

  var query = structureLayer.createQuery();
  const queryDefault = "1=1";
  const queryContractp = "CP = '" + contractcp + "'";

  if (contractcp === "All") {
    structureLayer.definitionExpression = queryDefault;
  } else {
    structureLayer.definitionExpression = queryContractp;
  }

  query.outFields = [structureStatusField];
  query.outStatistics = [total_count];
  query.orderByFields = [structureStatusField];
  query.groupByFieldsForStatistics = [structureStatusField];

  return structureLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features;
    const data = stats.map((result: any, index: any) => {
      const attributes = result.attributes;
      const status_id = attributes.StatusStruc;
      const count = attributes.total_count;
      return Object.assign({
        category: statusStructureLabel[status_id - 1],
        value: count,
      });
    });

    const data1: any = [];
    statusStructureLabel.map((status: any, index: any) => {
      const find = data.find((emp: any) => emp.category === status);
      const value = find === undefined ? 0 : find?.value;
      const object = {
        category: status,
        value: value,
        sliceSettings: {
          fill: am5.color(statusStructureQuery[index].color),
        },
      };
      data1.push(object);
    });
    return data1;
  });
}

// For Permit-to-Enter
export async function generateStrucNumber() {
  var total_pte_structure = new StatisticDefinition({
    onStatisticField: "CASE WHEN PTE = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pte_structure",
    statisticType: "sum",
  });

  var total_struc_N = new StatisticDefinition({
    onStatisticField: "CASE WHEN StatusStruc >=1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_struc_N",
    statisticType: "sum",
  });

  var query = structureLayer.createQuery();

  query.outStatistics = [total_pte_structure, total_struc_N];
  return structureLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const pte = stats.total_pte_structure;
    const totaln = stats.total_struc_N;
    const percPTE = Number(((pte / totaln) * 100).toFixed(0));
    return [percPTE, pte, totaln];
  });
}

// Non-Land Owner
const statusNlo = [
  "Relocated",
  "Paid",
  "For Payment Processing",
  "For Legal Pass",
  "For Appraisal/OtC/Requirements for Other Entitlements",
  "LBP Account Opening",
];

export const statusNloChart = [
  {
    category: statusNlo[0],
    value: 1,
  },
  {
    category: statusNlo[1],
    value: 2,
  },
  {
    category: statusNlo[2],
    value: 3,
  },
  {
    category: statusNlo[3],
    value: 4,
  },
  {
    category: statusNlo[4],
    value: 5,
  },
  {
    category: statusNlo[5],
    value: 6,
  },
];

export async function generateNloData() {
  var total_relocated_lot = new StatisticDefinition({
    onStatisticField: "CASE WHEN StatusRC = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_relocated_lot",
    statisticType: "sum",
  });

  var total_paid_lot = new StatisticDefinition({
    onStatisticField: "CASE WHEN StatusRC = 2 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_paid_lot",
    statisticType: "sum",
  });

  var total_payp_lot = new StatisticDefinition({
    onStatisticField: "CASE WHEN StatusRC = 3 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_payp_lot",
    statisticType: "sum",
  });

  var total_legalpass_lot = new StatisticDefinition({
    onStatisticField: "CASE WHEN StatusRC = 4 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_legalpass_lot",
    statisticType: "sum",
  });

  var total_otc_lot = new StatisticDefinition({
    onStatisticField: "CASE WHEN StatusRC = 5 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_otc_lot",
    statisticType: "sum",
  });

  var total_lbp_lot = new StatisticDefinition({
    onStatisticField: "CASE WHEN StatusRC = 6 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_lbp_lot",
    statisticType: "sum",
  });

  var query = nloLayer.createQuery();
  query.outStatistics = [
    total_relocated_lot,
    total_paid_lot,
    total_payp_lot,
    total_legalpass_lot,
    total_otc_lot,
    total_lbp_lot,
  ];
  query.returnGeometry = true;

  return nloLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;

    const clear = stats.total_relocated_lot;
    const paid = stats.total_paid_lot;
    const payp = stats.total_payp_lot;
    const legalpass = stats.total_legalpass_lot;
    const otc = stats.total_otc_lot;
    const lbp = stats.total_lbp_lot;

    const compile = [
      {
        category: statusNlo[0],
        value: clear,
        sliceSettings: {
          fill: am5.color("#00C5FF"),
        },
      },
      {
        category: statusNlo[1],
        value: paid,
        sliceSettings: {
          fill: am5.color("#70AD47"),
        },
      },
      {
        category: statusNlo[2],
        value: payp,
        sliceSettings: {
          fill: am5.color("#0070FF"),
        },
      },
      {
        category: statusNlo[3],
        value: legalpass,
        sliceSettings: {
          fill: am5.color("#FFFF00"),
        },
      },
      {
        category: statusNlo[4],
        value: otc,
        sliceSettings: {
          fill: am5.color("#FFAA00"),
        },
      },
      {
        category: statusNlo[5],
        value: lbp,
        sliceSettings: {
          fill: am5.color("#FF0000"),
        },
      },
    ];
    return compile;
  });
}

export async function generateNloNumber() {
  var total_lbp = new StatisticDefinition({
    onStatisticField: "CASE WHEN StatusRC >= 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_lbp",
    statisticType: "sum",
  });

  var query = nloLayer.createQuery();
  query.outStatistics = [total_lbp];
  return nloLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const totalnlo = stats.total_lbp;

    return totalnlo;
  });
}

/* Trees */
const statusTreeCutting: string[] = [
  "Cut/Earthballed",
  "Permit Acquired",
  "Submitted to DENR",
  "Ongoing Acquisition of Application Documents",
];

export const statusTreeCuttingChart = [
  {
    category: statusTreeCutting[0],
    value: 1,
  },
  {
    category: statusTreeCutting[1],
    value: 2,
  },
  {
    category: statusTreeCutting[2],
    value: 3,
  },
  {
    category: statusTreeCutting[3],
    value: 4,
  },
];

export async function generateTreeCuttingData() {
  var total_cut = new StatisticDefinition({
    onStatisticField: "CASE WHEN Status = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_cut",
    statisticType: "sum",
  });

  var total_permit = new StatisticDefinition({
    onStatisticField: "CASE WHEN Status = 2 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_permit",
    statisticType: "sum",
  });

  var total_denr = new StatisticDefinition({
    onStatisticField: "CASE WHEN Status = 3 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_denr",
    statisticType: "sum",
  });

  var total_ongoing = new StatisticDefinition({
    onStatisticField: "CASE WHEN Status = 4 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_ongoing",
    statisticType: "sum",
  });

  var query = treeCuttingLayer.createQuery();
  query.outStatistics = [total_cut, total_permit, total_denr, total_ongoing];
  query.returnGeometry = true;

  return treeCuttingLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const cut = stats.total_cut;
    const permit = stats.total_permit;
    const denr = stats.total_denr;
    const ongoing = stats.total_ongoing;

    const data = [
      {
        category: statusTreeCutting[0],
        value: cut,
        sliceSettings: {
          fill: am5.color(colorsCutting[0]),
        },
      },
      {
        category: statusTreeCutting[1],
        value: permit,
        sliceSettings: {
          fill: am5.color(colorsCutting[1]),
        },
      },
      {
        category: statusTreeCutting[2],
        value: denr,
        sliceSettings: {
          fill: am5.color(colorsCutting[2]),
        },
      },
      {
        category: statusTreeCutting[3],
        value: ongoing,
        sliceSettings: {
          fill: am5.color(colorsCutting[3]),
        },
      },
    ];
    return data;
  });
}

const statusTreeCompensation: string[] = [
  "Non-Compensable",
  "For Processing",
  "Compensated",
];

export const statusTreeCompensationChart = [
  {
    category: statusTreeCompensation[0],
    value: 1,
  },
  {
    category: statusTreeCompensation[1],
    value: 2,
  },
  {
    category: statusTreeCompensation[2],
    value: 3,
  },
];

export async function generateTreeCompensationData() {
  var total_noncomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN Compensation = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_noncomp",
    statisticType: "sum",
  });

  var total_process = new StatisticDefinition({
    onStatisticField: "CASE WHEN Compensation = 2 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_process",
    statisticType: "sum",
  });

  var total_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN Compensation = 3 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_comp",
    statisticType: "sum",
  });

  var query = treeCompensationLayer.createQuery();
  query.outStatistics = [total_noncomp, total_process, total_comp];
  query.returnGeometry = true;

  return treeCompensationLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const nocompen = stats.total_noncomp;
    const processing = stats.total_process;
    const compen = stats.total_comp;

    const data = [
      {
        category: statusTreeCompensation[0],
        value: nocompen,
        sliceSettings: {
          fill: am5.color(colorsCompen[0]),
        },
      },
      {
        category: statusTreeCompensation[1],
        value: processing,
        sliceSettings: {
          fill: am5.color(colorsCompen[1]),
        },
      },
      {
        category: statusTreeCompensation[2],
        value: compen,
        sliceSettings: {
          fill: am5.color(colorsCompen[2]),
        },
      },
    ];
    return data;
  });
}

export async function generateTreesNumber() {
  var total_cut_tree = new StatisticDefinition({
    onStatisticField: "CASE WHEN Status >= 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_cut_tree",
    statisticType: "sum",
  });

  var total_compensation_tree = new StatisticDefinition({
    onStatisticField: "CASE WHEN Compensation >= 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_compensation_tree",
    statisticType: "sum",
  });

  var query = treeCuttingLayer.createQuery();
  query.outStatistics = [total_cut_tree, total_compensation_tree];
  query.returnGeometry = true;

  return treeCuttingLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const cut = stats.total_cut_tree;
    const compen = stats.total_compensation_tree;
    return [cut, compen];
  });
}

const utilityType = ["Telecom", "Water", "Sewage", "Power"];
export const utilityTypeChart = [
  {
    category: utilityType[0],
    value: 1,
  },
  {
    category: utilityType[1],
    value: 2,
  },
  {
    category: utilityType[2],
    value: 3,
  },
  {
    category: utilityType[3],
    value: 4,
  },
];

export async function generateUtilityPointData() {
  var total_telecom_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 1 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_telecom_incomp",
    statisticType: "sum",
  });

  var total_telecom_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 1 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_telecom_comp",
    statisticType: "sum",
  });

  var total_water_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 2 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_water_incomp",
    statisticType: "sum",
  });

  var total_water_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 2 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_water_comp",
    statisticType: "sum",
  });

  var total_sewage_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 3 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_sewage_incomp",
    statisticType: "sum",
  });

  var total_sewage_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 3 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_sewage_comp",
    statisticType: "sum",
  });

  var total_power_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 4 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_power_incomp",
    statisticType: "sum",
  });

  var total_power_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 4 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_power_comp",
    statisticType: "sum",
  });

  var query = utilityPointLayer.createQuery();
  query.outStatistics = [
    total_telecom_incomp,
    total_telecom_comp,
    total_water_incomp,
    total_water_comp,
    total_sewage_incomp,
    total_sewage_comp,
    total_power_incomp,
    total_power_comp,
  ];

  return utilityPointLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const telecom_incomp = stats.total_telecom_incomp;
    const telecom_comp = stats.total_telecom_comp;
    const water_incomp = stats.total_water_incomp;
    const water_comp = stats.total_water_comp;
    const sewage_incomp = stats.total_sewage_incomp;
    const sewage_comp = stats.total_sewage_comp;
    const power_incomp = stats.total_power_incomp;
    const power_comp = stats.total_power_comp;

    const data = [
      {
        category: utilityType[0],
        comp: telecom_comp,
        incomp: telecom_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Telecom_Logo2.svg",
      },
      {
        category: utilityType[1],
        comp: water_comp,
        incomp: water_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Water_Logo2.svg",
      },
      {
        category: utilityType[2],
        comp: sewage_comp,
        incomp: sewage_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Sewage_Logo2.svg",
      },
      {
        category: utilityType[3],
        comp: power_comp,
        incomp: power_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Power_Logo2.svg",
      },
    ];

    return data;
  });
}

export async function generateUtilityLineData() {
  var total_telecom_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 1 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_telecom_incomp",
    statisticType: "sum",
  });

  var total_telecom_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 1 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_telecom_comp",
    statisticType: "sum",
  });

  var total_water_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 2 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_water_incomp",
    statisticType: "sum",
  });

  var total_water_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 2 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_water_comp",
    statisticType: "sum",
  });

  var total_sewage_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 3 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_sewage_incomp",
    statisticType: "sum",
  });

  var total_sewage_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 3 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_sewage_comp",
    statisticType: "sum",
  });

  var total_power_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 4 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_power_incomp",
    statisticType: "sum",
  });

  var total_power_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 4 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_power_comp",
    statisticType: "sum",
  });

  var query = utilityLineLayer.createQuery();
  query.outStatistics = [
    total_telecom_incomp,
    total_telecom_comp,
    total_water_incomp,
    total_water_comp,
    total_sewage_incomp,
    total_sewage_comp,
    total_power_incomp,
    total_power_comp,
  ];

  return utilityLineLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const telecom_incomp = stats.total_telecom_incomp;
    const telecom_comp = stats.total_telecom_comp;
    const water_incomp = stats.total_water_incomp;
    const water_comp = stats.total_water_comp;
    const sewage_incomp = stats.total_sewage_incomp;
    const sewage_comp = stats.total_sewage_comp;
    const power_incomp = stats.total_power_incomp;
    const power_comp = stats.total_power_comp;

    const data = [
      {
        category: utilityType[0],
        comp: telecom_comp,
        incomp: telecom_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Telecom_Logo2.svg",
      },
      {
        category: utilityType[1],
        comp: water_comp,
        incomp: water_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Water_Logo2.svg",
      },
      {
        category: utilityType[2],
        comp: sewage_comp,
        incomp: sewage_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Sewage_Logo2.svg",
      },
      {
        category: utilityType[3],
        comp: power_comp,
        incomp: power_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Power_Logo2.svg",
      },
    ];

    return data;
  });
}

export async function generateUtilityNumbers(contractp: any) {
  var total_util_number = new StatisticDefinition({
    onStatisticField: "Status",
    outStatisticFieldName: "total_util_number",
    statisticType: "count",
  });

  var total_util_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN Status = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_util_comp",
    statisticType: "sum",
  });

  var query = new Query();
  const defaultQuery = "1=1";
  const qContractp = "CP = '" + contractp + "'";

  query.where = contractp === "All" ? defaultQuery : qContractp;
  query.outStatistics = [total_util_number, total_util_comp];

  const pointQuery = utilityPointLayer
    .queryFeatures(query)
    .then((response: any) => {
      var stats = response.features[0].attributes;
      const comp = stats.total_util_comp;
      const total = stats.total_util_number;

      return [total, comp];
    });

  const lineQuery = utilityLineLayer
    .queryFeatures(query)
    .then((response: any) => {
      var stats = response.features[0].attributes;
      const comp = stats.total_util_comp;
      const total = stats.total_util_number;

      return [total, comp];
    });

  const point = await pointQuery;
  const line = await lineQuery;

  const total = point[0] + line[0];
  const comp = point[1] + line[1];
  const progress = ((comp / total) * 100).toFixed(0);
  return [total, progress];
}

// Generate chart data
const viaductType = ["Bored Pile", "Pile Cap", "Pier", "Pier Head", "Precast"];

export const viaductTypeChart = [
  {
    category: viaductType[0],
    value: 1,
  },
  {
    category: viaductType[1],
    value: 2,
  },
  {
    category: viaductType[2],
    value: 3,
  },
  {
    category: viaductType[3],
    value: 4,
  },
  {
    category: viaductType[4],
    value: 5,
  },
];
export async function generateViaductChartData(contractp: any) {
  var total_boredpile_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 1 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_boredpile_incomp",
    statisticType: "sum",
  });

  var total_boredpile_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 1 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_boredpile_comp",
    statisticType: "sum",
  });

  var total_boredpile_delay = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 1 and Status = 3) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_boredpile_delay",
    statisticType: "sum",
  });

  var total_pilecap_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 2 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pilecap_incomp",
    statisticType: "sum",
  });

  var total_pilecap_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 2 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pilecap_comp",
    statisticType: "sum",
  });

  var total_pilecap_delay = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 2 and Status = 3) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pilecap_delay",
    statisticType: "sum",
  });

  var total_pier_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 3 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pier_incomp",
    statisticType: "sum",
  });

  var total_pier_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 3 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pier_comp",
    statisticType: "sum",
  });

  var total_pier_delay = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 3 and Status = 3) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pier_delay",
    statisticType: "sum",
  });

  var total_pierhead_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 4 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pierhead_incomp",
    statisticType: "sum",
  });

  var total_pierhead_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 4 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pierhead_comp",
    statisticType: "sum",
  });

  var total_pierhead_delay = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 4 and Status = 3) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pierhead_delay",
    statisticType: "sum",
  });

  var total_precast_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 5 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_precast_incomp",
    statisticType: "sum",
  });

  var total_precast_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 5 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_precast_comp",
    statisticType: "sum",
  });

  var total_precast_delay = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 5 and Status = 3) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_precast_delay",
    statisticType: "sum",
  });

  // Query
  var query = viaductLayer.createQuery();
  query.outStatistics = [
    total_boredpile_incomp,
    total_boredpile_comp,
    total_boredpile_delay,
    total_pilecap_incomp,
    total_pilecap_delay,
    total_pilecap_comp,
    total_pier_incomp,
    total_pier_delay,
    total_pier_comp,
    total_pierhead_incomp,
    total_pierhead_delay,
    total_pierhead_comp,
    total_precast_incomp,
    total_precast_delay,
    total_precast_comp,
  ];

  // Query
  const defaultExpression = "1=1";
  const expression = "CP = '" + contractp + "'";
  if (contractp === "All") {
    viaductLayer.definitionExpression = defaultExpression;
    query.where = defaultExpression;
  } else {
    query.where = expression;
    viaductLayer.definitionExpression = expression;
  }

  return viaductLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const pile_incomp = stats.total_boredpile_incomp;
    const pile_delay = stats.total_boredpile_delay;
    const pile_comp = stats.total_boredpile_comp;
    const pilecap_incomp = stats.total_pilecap_incomp;
    const pilecap_delay = stats.total_pilecap_delay;
    const pilecap_comp = stats.total_pier_comp;
    const pier_incomp = stats.total_pier_incomp;
    const pier_delay = stats.total_pier_delay;
    const pier_comp = stats.total_pier_comp;
    const pierhead_incomp = stats.total_pierhead_incomp;
    const pierhead_delay = stats.total_pierhead_delay;
    const pierhead_comp = stats.total_pierhead_comp;
    const precast_incomp = stats.total_precast_incomp;
    const precast_delay = stats.total_precast_delay;
    const precast_comp = stats.total_precast_comp;

    const data = [
      {
        category: viaductType[0],
        comp: pile_comp,
        incomp: pile_incomp,
        delay: pile_delay,
        icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pile_Logo.svg",
      },
      {
        category: viaductType[1],
        comp: pilecap_comp,
        incomp: pilecap_incomp,
        delay: pilecap_delay,
        icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pilecap_Logo.svg",
      },
      {
        category: viaductType[2],
        comp: pier_comp,
        incomp: pier_incomp,
        delay: pier_delay,
        icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pier_Logo.svg",
      },
      {
        category: viaductType[3],
        comp: pierhead_comp,
        incomp: pierhead_incomp,
        delay: pierhead_delay,
        icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pierhead_Logo.svg",
      },
      {
        category: viaductType[4],
        comp: precast_comp,
        incomp: precast_incomp,
        delay: precast_delay,
        icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
      },
    ];
    return data;
  });
}

export async function generateTotalProgress(contractp: any) {
  var total_viaduct_number = new StatisticDefinition({
    onStatisticField: "uniqueID",
    outStatisticFieldName: "total_viaduct_number",
    statisticType: "count",
  });

  var total_viaduct_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN Status = 4 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_viaduct_comp",
    statisticType: "sum",
  });

  var query = viaductLayer.createQuery();
  const defaultExpression = "1=1";
  const expression = "CP = '" + contractp + "'";
  if (contractp === "All") {
    viaductLayer.definitionExpression = defaultExpression;
    query.where = defaultExpression;
  } else {
    query.where = expression;
    viaductLayer.definitionExpression = expression;
  }

  query.outStatistics = [total_viaduct_number, total_viaduct_comp];

  return viaductLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const comp = stats.total_viaduct_comp;
    const total = stats.total_viaduct_number;
    const progress = ((comp / total) * 100).toFixed(1);

    return [total, comp, progress];
  });
}

export async function viaductProgressChartData(contractp: any) {
  var total_complete_pile = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Status = 4 and Type = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_pile",
    statisticType: "sum",
  });

  var total_complete_pilecap = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Status = 4 and Type = 2) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_pilecap",
    statisticType: "sum",
  });

  var total_complete_pier = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Status = 4 and Type = 3) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_pier",
    statisticType: "sum",
  });

  var total_complete_pierhead = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Status = 4 and Type = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_pierhead",
    statisticType: "sum",
  });

  var total_complete_precast = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Status = 4 and Type = 5) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_precast",
    statisticType: "sum",
  });

  var query = viaductLayer.createQuery();
  // eslint-disable-next-line no-useless-concat
  const defaultExpression = "1=1";
  if (contractp === "All") {
    // eslint-disable-next-line no-useless-concat
    query.where = "end_date IS NOT NULL" + " AND " + defaultExpression;
  } else {
    // eslint-disable-next-line no-useless-concat
    query.where = "end_date IS NOT NULL" + " AND " + "CP = '" + contractp + "'";
  }

  query.outStatistics = [
    total_complete_pile,
    total_complete_pilecap,
    total_complete_pier,
    total_complete_pierhead,
    total_complete_precast,
  ];
  query.outFields = ["end_date", "CP"];
  query.orderByFields = ["end_date"];
  query.groupByFieldsForStatistics = ["end_date"];

  return viaductLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features;

    // collect all dates for each viaduct type
    const data = stats.map((result: any, index: any) => {
      const attributes = result.attributes;
      const date = attributes.end_date;

      const pileCount = attributes.total_complete_pile;
      const pilecapCount = attributes.total_complete_pilecap;
      const pierCount = attributes.total_complete_pier;
      const pierheadCount = attributes.total_complete_pierhead;
      const precastCount = attributes.total_complete_precast;

      // compile in object
      return Object.assign(
        {},
        {
          date,
          pile: pileCount,
          pilecap: pilecapCount,
          pier: pierCount,
          piearhead: pierheadCount,
          precast: precastCount,
        }
      );
    });
    return data;
  });
}

export const dateFormat = (inputDate: any, format: any) => {
  //parse the input date
  const date = new Date(inputDate);

  //extract the parts of the date
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  //replace the month
  format = format.replace("MM", month.toString().padStart(2, "0"));

  //replace the year
  if (format.indexOf("yyyy") > -1) {
    format = format.replace("yyyy", year.toString());
  } else if (format.indexOf("yy") > -1) {
    format = format.replace("yy", year.toString().substr(2, 2));
  }

  //replace the day
  format = format.replace("dd", day.toString().padStart(2, "0"));

  return format;
};

// station structures
export const layerVisibleTrue = () => {
  stColumnLayer.visible = true;
  stFoundationLayer.visible = true;
  stFramingLayer.visible = true;
  floorsLayer.visible = true;
  wallsLayer.visible = true;
  columnsLayer.visible = true;
  buildingLayer.visible = true;
};

const layerVisibleFalse = () => {
  stColumnLayer.visible = false;
  stFoundationLayer.visible = false;
  stFramingLayer.visible = false;
  floorsLayer.visible = false;
  wallsLayer.visible = false;
  buildingLayer.visible = false;
};

export async function stationStructureDisplay(contractcp: any) {
  const queryExpression = "CP = '" + contractcp + "'";
  const queryAll = "1=1";

  if (contractcp === "All") {
    stColumnLayer.definitionExpression = queryAll;
    stFoundationLayer.definitionExpression = queryAll;
    stFramingLayer.definitionExpression = queryAll;
    columnsLayer.definitionExpression = queryAll;
    floorsLayer.definitionExpression = queryAll;
    wallsLayer.definitionExpression = queryAll;

    layerVisibleFalse();
  } else {
    stColumnLayer.definitionExpression = queryExpression;
    stFoundationLayer.definitionExpression = queryExpression;
    stFramingLayer.definitionExpression = queryExpression;
    columnsLayer.definitionExpression = queryExpression;
    floorsLayer.definitionExpression = queryExpression;
    wallsLayer.definitionExpression = queryExpression;
    // layerVisibleFalse();
    layerVisibleTrue();
  }
}

// Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }
}

export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}

let highlight: any;
export function highlightLot(layer: any, view: any) {
  view?.whenLayerView(layer).then((urgentLayerView: any) => {
    var query = layer.createQuery();
    layer.queryFeatures(query).then((results: any) => {
      const length = results.features.length;
      let objID = [];
      for (var i = 0; i < length; i++) {
        var obj = results.features[i].attributes.OBJECTID;
        objID.push(obj);
      }

      if (highlight) {
        highlight.remove();
      }
      highlight = urgentLayerView.highlight(objID);
    });
  });
}

export function highlightRemove(layer: any) {
  if (highlight) {
    highlight.remove();
  }
}

export function defineActions(event: any) {
  const { item } = event;
  if (item.title === "Sapang Balen River Realignment") {
    item.actionsSections = new Collection([
      new Collection([
        new ActionButton({
          title: "Zoom to Area",
          icon: "zoom-in-fixed",
          id: "full-extent-sapangbalenriver",
        }),
      ]),
    ]);
  }

  if (item.title === "NGCP Line") {
    item.actionsSections = new Collection([
      new Collection([
        new ActionButton({
          title: "Zoom to Area",
          icon: "zoom-in-fixed",
          id: "full-extent-ngcpline",
        }),
      ]),
    ]);
  }

  if (item.title === "NGCP Pole Relocation Working Area") {
    item.actionsSections = new Collection([
      new Collection([
        new ActionButton({
          title: "Zoom to Area",
          icon: "zoom-in-fixed",
          id: "full-extent-ngcpworkarea",
        }),
      ]),
    ]);
  }

  if (item.title === "NGCP Pole Relocation Tagged Structures") {
    item.actionsSections = new Collection([
      new Collection([
        new ActionButton({
          title: "Zoom to Area",
          icon: "zoom-in-fixed",
          id: "full-extent-taggedstructure",
        }),
      ]),
    ]);

    highlightLot(ngcp_tagged_structureLayer, arcgisScene);
  }

  if (item.layer.type !== "group") {
    item.panel = {
      content: "legend",
      open: true,
    };
  }

  item.title === "Chainage" ||
  item.title === "Households" ||
  item.title === "Households Ownership (Structure)" ||
  item.title === "Occupancy (Structure)" ||
  item.title === "Structure" ||
  item.title === "NGCP Pole Relocation Working Area" ||
  item.title === "NGCP Pole Relocation Tagged Structures" ||
  item.title === "Land Acquisition (Endorsed Status)" ||
  item.title === "Super Urgent Lot" ||
  item.title === "Handed-Over (public + private)" ||
  item.title === "Tree Cutting" ||
  item.title === "Tree Compensation" ||
  item.title === "Point (symbol)" ||
  item.title === "Point (status)" ||
  item.title === "Line (symbol)" ||
  item.title === "Line (status)" ||
  item.title === "Pier Head/Column" ||
  item.title === "Viaduct" ||
  item.title === "Station Structures"
    ? (item.visible = false)
    : (item.visible = true);
}

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import {
  TextSymbol3DLayer,
  LabelSymbol3D,
  PolygonSymbol3D,
  ExtrudeSymbol3DLayer,
  PointSymbol3D,
  IconSymbol3DLayer,
  SimpleMarkerSymbol,
  LineSymbol3D,
  PathSymbol3DLayer,
  WebStyleSymbol,
  MeshSymbol3D,
  FillSymbol3DLayer,
  SimpleLineSymbol,
} from "@arcgis/core/symbols";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import SizeVariable from "@arcgis/core/renderers/visualVariables/SizeVariable";
import RotationVariable from "@arcgis/core/renderers/visualVariables/RotationVariable";
import { labelSymbol3DLine } from "./Label";
import ColorVariable from "@arcgis/core/renderers/visualVariables/ColorVariable";
import {
  barangayField,
  cpField,
  endorsedField,
  familyNumberField,
  handedOverLotField,
  landOwnerField,
  landUseField,
  lotHandedOverDateField,
  lotStatusField,
  municipalityField,
  nloLoStatusField,
  nloStatusField,
  occupancyField,
  occupancyNameField,
  percentHandedOverField,
  strucOwnerField,
  superUrgentField,
  treeCommonNameField,
  treeStatusField,
  treeMunicipalityField,
  treeProvinceField,
  treeScientificNameField,
  valueLabelColor,
  treeNoField,
  treeCpField,
  treeCompensationStatusField,
  treeConservationField,
  utilityType2Field,
  utilityType2SymbolList,
  utilityHeightField,
  utilityIdField,
  utilityTypeField,
  utilityActionField,
  utilityStatusField,
  utilityCpField,
  utilityRemarksField,
  utilityCompanyField,
  statusStructureLabel,
  statusStructureQuery,
  structureStatusField,
} from "./StatusUniqueValues";

/* Standalone table for Dates */
export const dateTable = new FeatureLayer({
  portalItem: {
    id: "b2a118b088a44fa0a7a84acbe0844cb2",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
});

/* Chainage Layer  */
var labelChainage = new LabelClass({
  labelExpressionInfo: { expression: "$feature.KmSpot" },
  symbol: {
    type: "text",
    color: [85, 255, 0],
    haloColor: "black",
    haloSize: 0.5,
    font: {
      size: 15,
      weight: "bold",
    },
  },
});

var chainageRenderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    size: 5,
    color: [255, 255, 255, 0.9],
    outline: {
      width: 0.2,
      color: "black",
    },
  }),
});

export const chainageLayer = new FeatureLayer({
  portalItem: {
    id: "876de8483da9485aac5df737cbef2143",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 5,
  title: "Chainage",
  elevationInfo: {
    mode: "relative-to-ground",
  },
  labelingInfo: [labelChainage],
  minScale: 150000,
  maxScale: 0,
  renderer: chainageRenderer,

  popupEnabled: false,
});

/* Station Box */
let stationBoxRenderer = new UniqueValueRenderer({
  field: "Layer",
  uniqueValueInfos: [
    {
      value: "00_Platform",
      label: "Platform",
      symbol: new SimpleFillSymbol({
        color: [160, 160, 160],
        style: "backward-diagonal",
        outline: {
          width: 1,
          color: "black",
        },
      }),
    },
    {
      value: "00_Platform 10car",
      label: "Platform 10car",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "cross",
        outline: {
          width: 1,
          color: "black",
          style: "short-dash",
        },
      }),
    },
    {
      value: "00_Station",
      label: "Station Box",
      symbol: new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: {
          width: 2,
          color: [115, 0, 0],
        },
      }),
    },
  ],
});

export const stationBoxLayer = new FeatureLayer({
  portalItem: {
    id: "876de8483da9485aac5df737cbef2143",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 3,
  renderer: stationBoxRenderer,
  minScale: 150000,
  maxScale: 0,
  title: "Station Box",

  popupEnabled: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* ROW Layer */
const prowRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#ff0000",
    width: "2px",
  }),
});

export const prowLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/N2_Alignment/FeatureServer/1",
  layerId: 1,
  title: "PROW",
  popupEnabled: false,
  renderer: prowRenderer,
});
prowLayer.listMode = "hide";

/* PNR */
let pnrRenderer = new UniqueValueRenderer({
  field: "OwnershipType",
  uniqueValueInfos: [
    {
      value: 1, // RP
      symbol: new SimpleFillSymbol({
        color: [137, 205, 102],
        style: "diagonal-cross",
        outline: {
          width: 0.5,
          color: "black",
        },
      }),
    },
    {
      value: 2, // PNR
      symbol: new SimpleFillSymbol({
        color: [137, 205, 102],
        style: "diagonal-cross",
        outline: {
          width: 0.5,
          color: "black",
        },
      }),
    },
    {
      value: 3, // BCDA
      symbol: new SimpleFillSymbol({
        color: [137, 205, 102],
        style: "diagonal-cross",
        outline: {
          width: 0.5,
          color: "black",
        },
      }),
    },
  ],
});

export const pnrLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  title: "Land (PNR)",
  definitionExpression: `${landOwnerField} IN ('BASES CONVERSION DEVELOPMENT AUTHORITY','MANILA RAILROAD COMPANY')`,
  elevationInfo: {
    mode: "on-the-ground",
  },
  labelsVisible: false,
  renderer: pnrRenderer,
  popupTemplate: {
    title: "<p>{LandOwner} ({LotID})</p>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: lotHandedOverDateField,
            label: "Hand-Over Date",
          },
          {
            fieldName: municipalityField,
          },
          {
            fieldName: barangayField,
          },
          {
            fieldName: landOwnerField,
            label: "Land Owner",
          },
        ],
      },
    ],
  },
});

/* Station Layer */
var labelClass = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: "#d4ff33",
        },
        size: 15,
        halo: {
          color: "black",
          size: 0.5,
        },
        font: {
          family: "Ubuntu Mono",
          //weight: "bold"
        },
      }),
    ],
    verticalOffset: {
      screenLength: 100,
      maxWorldLength: 700,
      minWorldLength: 80,
    },

    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: [128, 128, 128, 0.5],
      size: 0.2,
      border: {
        color: "grey",
      },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.Station",
    //value: "{TEXTSTRING}"
  },
});

export const stationLayer = new FeatureLayer({
  portalItem: {
    id: "876de8483da9485aac5df737cbef2143",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  title: "N2 Stations",
  labelingInfo: [labelClass],
  elevationInfo: {
    mode: "relative-to-ground",
  },
});
stationLayer.listMode = "hide";

/* Land and Structure Layers */
/* The colors used for the each transit line */
var lotIdLabel = new LabelClass({
  labelExpressionInfo: { expression: "$feature.LotID" },
  symbol: {
    type: "text",
    color: "black",
    haloColor: "white",
    haloSize: 0.5,
    font: {
      size: 11,
      weight: "bold",
    },
  },
});

/* uniqueRenderer */
const colorLotReqs = {
  0: [0, 197, 255],
  1: [112, 173, 71],
  2: [0, 112, 255],
  3: [255, 255, 0],
  4: [255, 170, 0],
  5: [255, 0, 0],
  6: [0, 0, 0, 0],
};

export const lotStatusArray = [
  "Paid",
  "For Payment Processing",
  "For Legal Pass",
  "For Offer to Buy",
  "For Notice of Taking",
  "With PTE",
  "For Expropriation",
];

export const statusLotColor = [
  "#00734d",
  "#0070ff",
  "#ffff00",
  "#ffaa00",
  "#FF5733",
  "#70AD47",
  "#FF0000",
];

let lotDefaultSymbol = new SimpleFillSymbol({
  color: [0, 0, 0, 0],
  style: "solid",
  outline: {
    // autocasts as new SimpleLineSymbol()
    color: [110, 110, 110],
    width: 0.7,
  },
});

const uniqueValueInfos_lotStatus = lotStatusArray.map(
  (status: any, index: any) => {
    return Object.assign({
      value: index + 1,
      label: status,
      symbol: new SimpleFillSymbol({
        color: statusLotColor[index],
      }),
    });
  }
);

let lotLayerRenderer = new UniqueValueRenderer({
  field: lotStatusField,
  defaultSymbol: lotDefaultSymbol, // autocasts as new SimpleFillSymbol()
  uniqueValueInfos: uniqueValueInfos_lotStatus,
});

// Custom popup for lot layer
const landUseArray = [
  "Agricultural",
  "Agricultural & Commercial",
  "Agricultural / Residential",
  "Commercial",
  "Industrial",
  "Irrigation",
  "Residential",
  "Road",
  "Road Lot",
  "Special Exempt",
];

const endorsedStatus = ["Not Endorsed", "Endorsed", "NA"];

let customContentLot = new CustomContent({
  outFields: ["*"],
  creator: (event: any) => {
    // Extract AsscessDate of clicked pierAccessLayer
    const handedOverDate = event.graphic.attributes[handedOverLotField];
    const handOverArea = event.graphic.attributes[percentHandedOverField];
    const statusLot = event.graphic.attributes[lotStatusField];
    const landUse = event.graphic.attributes[landUseField];
    const municipal = event.graphic.attributes[municipalityField];
    const barangay = event.graphic.attributes[barangayField];
    const landOwner = event.graphic.attributes[landOwnerField];
    const cpNo = event.graphic.attributes[cpField];
    const endorse = event.graphic.attributes[endorsedField];
    const endorsed = endorsedStatus[endorse];

    let daten: any;
    let date: any;
    if (handedOverDate) {
      daten = new Date(handedOverDate);
      const year = daten.getFullYear();
      const month = daten.getMonth();
      const day = daten.getDay();
      date = `${year}-${month}-${day}`;
    } else {
      date = "Undefined";
    }
    // Convert numeric to date format 0
    //var daten = new Date(handedOverDate);
    //var date = dateFormat(daten, 'MM-dd-yyyy');
    //<li>Hand-Over Date: <b>${date}</b></li><br>

    return `<ul><li>Handed-Over Area: <b>${handOverArea} %</b></li>
    <li>Hand-Over Date: <b>${date}</b></li>
              <li>Status:           <b>${
                statusLot >= 0 ? lotStatusArray[statusLot - 1] : ""
              }</b></li>
              <li>Land Use:         <b>${
                landUse >= 1 ? landUseArray[landUse - 1] : ""
              }</b></li>
              <li>Municipality:     <b>${municipal}</b></li>
              <li>Barangay:         <b>${barangay}</b></li>
              <li>Land Owner:       <b>${landOwner}</b>
              <li>CP:               <b>${cpNo}</b>
              <li>Endorsed:         <b>${endorsed}</b></li></ul>`;
  },
});

const templateLot = new PopupTemplate({
  title: "Lot No.: <b>{LotID}</b>",
  lastEditInfoEnabled: false,
  content: [customContentLot],
});

export const lotLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  labelingInfo: [lotIdLabel],
  renderer: lotLayerRenderer,

  popupTemplate: templateLot,
  title: "Land Acquisition",
  minScale: 150000,
  maxScale: 0,
  //labelsVisible: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* Endorsed Lot Layer */
// Endorsed lot layer
let endorsedLayerRenderer = new UniqueValueRenderer({
  field: endorsedField,
  defaultSymbol: lotDefaultSymbol,
  uniqueValueInfos: [
    {
      value: 0,
      label: "Not Endorsed",
      symbol: new SimpleFillSymbol({
        color: colorLotReqs[5],
      }),
    },
    {
      value: 1,
      label: "Endorsed",
      symbol: new SimpleFillSymbol({
        color: colorLotReqs[2],
      }),
    },
    {
      value: 2,
      label: "NA",
      symbol: new SimpleFillSymbol({
        color: [211, 211, 211, 0.7],
      }),
    },
  ],
});

export const endorsedLotLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  renderer: endorsedLayerRenderer,
  labelingInfo: [lotIdLabel],

  title: "Land Acquisition (Endorsed Status)",
  minScale: 150000,
  maxScale: 0,
  //labelsVisible: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});
endorsedLotLayer.popupTemplate = templateLot;

/* Supre Urgent Lots */
const superUrgentLotRenderer = new UniqueValueRenderer({
  field: superUrgentField,

  uniqueValueInfos: [
    {
      value: 0,
      label: "Super Urgent",
      symbol: new SimpleFillSymbol({
        color: [255, 0, 0, 0],
        outline: {
          color: [255, 0, 0, 1],
          width: 0.3,
        },
      }),
    },
  ],
});

export const superUrgentLotLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  definitionExpression: `${superUrgentField} = 0`,
  renderer: superUrgentLotRenderer,
  popupEnabled: false,
  labelsVisible: false,
  title: "Super Urgent Lot",
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* Handed-Over Lot (public + private) */
const handedOverLotRenderer = new UniqueValueRenderer({
  field: handedOverLotField,

  uniqueValueInfos: [
    {
      value: 1,
      label: "Handed-Over",
      symbol: new SimpleFillSymbol({
        color: [0, 255, 255, 0.3], //[0, 255, 255, 0.1], #00ffff
        outline: new SimpleLineSymbol({
          color: "#00ffff",
          width: "4px",
        }),
      }),
    },
  ],
});

export const handedOverLotLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  definitionExpression: `${handedOverLotField} = 1`,
  renderer: handedOverLotRenderer,
  popupEnabled: false,
  title: "Handed-Over (public + private)",
  elevationInfo: {
    mode: "on-the-ground",
  },
});
handedOverLotLayer.listMode = "hide";

/* Structure Layer */
const height = 5;
const edgeSize = 0.3;

const defaultStructureRenderer = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: 5,
      material: {
        color: [0, 0, 0, 0.4],
      },
      edges: new SolidEdges3D({
        color: "#4E4E4E",
        size: edgeSize,
      }),
    }),
  ],
});

const structureRendererUniqueValueInfos = statusStructureLabel.map(
  (status: any, index: any) => {
    return Object.assign({
      value: index + 1,
      symbol: new PolygonSymbol3D({
        symbolLayers: [
          new ExtrudeSymbol3DLayer({
            size: height,
            material: {
              color: statusStructureQuery[index].colorLayer,
            },
            edges: new SolidEdges3D({
              color: "#4E4E4E",
              size: edgeSize,
            }),
          }),
        ],
      }),
      label: status,
    });
  }
);

const structureRenderer = new UniqueValueRenderer({
  defaultSymbol: defaultStructureRenderer,
  defaultLabel: "Other",
  field: "StatusStruc",
  uniqueValueInfos: structureRendererUniqueValueInfos,
});

export const structureLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 3,
  title: "Structure",
  renderer: structureRenderer,

  elevationInfo: {
    mode: "on-the-ground",
  },
  popupTemplate: {
    title: "<p>{StrucID}</p>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: familyNumberField,
            label: "<b>Number of Families</b>",
          },
          {
            fieldName: strucOwnerField,
            label: "Structure Owner",
          },
          {
            fieldName: municipalityField,
          },
          {
            fieldName: barangayField,
          },
          {
            fieldName: structureStatusField,
            label: "<p>Status for Structure</p>",
          },
          {
            fieldName: occupancyNameField,
          },
          {
            fieldName: nloLoStatusField,
            label: "NLO/LO Ownership (structure) ",
          },
        ],
      },
    ],
  },
});

/* NGCP */
const ngcpPoleWARenderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [197, 0, 255],
    style: "backward-diagonal",
    outline: {
      color: "#C500FF",
      width: 0.7,
    },
  }),
});

export const ngcp_working_area = new FeatureLayer({
  portalItem: {
    id: "ef4460e67411480aa8315e897e9b172d",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  renderer: ngcpPoleWARenderer,
  elevationInfo: {
    mode: "on-the-ground",
  },
  definitionExpression: "SiteNo = '2'",
  title: "NGCP Pole Relocation Working Area",
});

const ngcp_tagged_structure_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [0, 0, 0, 0],
    outline: {
      color: "#00ffffff",
      width: 1,
    },
  }),
});

export const ngcp_tagged_structureLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 3,
  title: "NGCP Pole Relocation Tagged Structures",
  definitionExpression: "NGCP_Affected = 1",
  renderer: ngcp_tagged_structure_renderer,
  elevationInfo: {
    mode: "on-the-ground",
  },
  popupEnabled: false,
});

// NLO Layer
const symbolSize = 30;

const nloSymbolRef = [
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_Relocated.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_Paid.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_PaymentProcess.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_LegalPass.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_OtC.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_LBP.svg",
];

const nloRenderer = new UniqueValueRenderer({
  field: nloStatusField,
  uniqueValueInfos: [
    {
      value: 1,
      label: "Relocated",
      symbol: new PointSymbol3D({
        symbolLayers: [
          new IconSymbol3DLayer({
            resource: {
              href: nloSymbolRef[0],
            },
            size: symbolSize,
            outline: {
              color: "white",
              size: 2,
            },
          }),
        ],
      }),
    },
    {
      value: 2,
      label: "Paid",
      symbol: new PointSymbol3D({
        symbolLayers: [
          new IconSymbol3DLayer({
            resource: {
              href: nloSymbolRef[1],
            },
            size: symbolSize,
            outline: {
              color: "white",
              size: 2,
            },
          }),
        ],
      }),
    },
    {
      value: 3,
      label: "For Payment Processing",
      symbol: new PointSymbol3D({
        symbolLayers: [
          new IconSymbol3DLayer({
            resource: {
              href: nloSymbolRef[2],
            },
            size: symbolSize,
            outline: {
              color: "white",
              size: 2,
            },
          }),
        ],
      }),
    },
    {
      value: 4,
      label: "For Legal Pass",
      symbol: new PointSymbol3D({
        symbolLayers: [
          new IconSymbol3DLayer({
            resource: {
              href: nloSymbolRef[3],
            },
            size: symbolSize,
            outline: {
              color: "white",
              size: 2,
            },
          }),
        ],
      }),
    },
    {
      value: 5,
      label: "For Appraisal/OtC/Reqs for Other Entitlements",
      symbol: new PointSymbol3D({
        symbolLayers: [
          new IconSymbol3DLayer({
            resource: {
              href: nloSymbolRef[4],
            },
            size: symbolSize,
            outline: {
              color: "white",
              size: 2,
            },
          }),
        ],
      }),
    },
    {
      value: 6,
      label: "LBP Account Opening",
      symbol: new PointSymbol3D({
        symbolLayers: [
          new IconSymbol3DLayer({
            resource: {
              href: nloSymbolRef[5],
            },
            size: symbolSize,
            outline: {
              color: "white",
              size: 2,
            },
          }),
        ],
      }),
    },
  ],
});

export const nloLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  renderer: nloRenderer,

  title: "NLO (Non-Land Owner)",
  elevationInfo: {
    mode: "relative-to-scene",
  },
  minScale: 10000,
  maxScale: 0,
  popupTemplate: {
    title: "<p>{StrucID}</p>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: strucOwnerField,
            label: "Structure Owner",
          },
          {
            fieldName: municipalityField,
          },
          {
            fieldName: barangayField,
          },
          {
            fieldName: nloStatusField,
            label: "<p>Status for Relocation</p>",
          },
          {
            fieldName: occupancyNameField,
          },
          {
            fieldName: nloStatusField,
            label: "NLO/LO Ownership (structure) ",
          },
        ],
      },
    ],
  },
});

/* Structure Ownership Layer */
let NLOLORenderer = new UniqueValueRenderer({
  field: nloLoStatusField,
  uniqueValueInfos: [
    {
      value: 1,
      label: "LO (Land Owner)",
      symbol: new SimpleFillSymbol({
        style: "forward-diagonal",
        color: [128, 128, 128, 1],
        outline: {
          color: "#6E6E6E",
          width: 0.3,
        },
      }),
    },
    {
      value: 2,
      label: "NLO (Non-Land Owner)",
      symbol: new SimpleFillSymbol({
        style: "vertical",
        color: [128, 128, 128, 1],
        outline: {
          color: "#6E6E6E",
          width: 0.3,
        },
      }),
    },
  ],
});

export const strucOwnershipLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  renderer: NLOLORenderer,
  layerId: 3,
  title: "NLO/LO Ownership (Structure)",

  popupEnabled: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* Occupancy (Status of Relocation) */
var verticalOffsetExistingOccupancy = {
  screenLength: 10,
  maxWorldLength: 10,
  minWorldLength: 10,
};
const occupancyPointSize = 20;

let occupancyRenderer = new UniqueValueRenderer({
  field: occupancyField,
  uniqueValueInfos: [
    {
      value: 0,
      label: "Occupied",
      symbol: new PointSymbol3D({
        symbolLayers: [
          new IconSymbol3DLayer({
            resource: {
              href: "https://EijiGorilla.github.io/Symbols/Demolished.png",
            },
            size: occupancyPointSize,
            outline: {
              color: "white",
              size: 2,
            },
          }),
        ],
        verticalOffset: verticalOffsetExistingOccupancy,

        callout: {
          type: "line", // autocasts as new LineCallout3D()
          color: [128, 128, 128, 0.6],
          size: 0.4,
          border: {
            color: "grey",
          },
        },
      }),
    },
    {
      value: 1,
      label: "Relocated",
      symbol: new PointSymbol3D({
        symbolLayers: [
          new IconSymbol3DLayer({
            resource: {
              href: "https://EijiGorilla.github.io/Symbols/DemolishComplete_v2.png",
            },
            size: occupancyPointSize,
            outline: {
              color: "white",
              size: 2,
            },
          }),
        ],
        verticalOffset: verticalOffsetExistingOccupancy,

        callout: {
          type: "line", // autocasts as new LineCallout3D()
          color: [128, 128, 128, 0.6],
          size: 0.4,
          border: {
            color: "grey",
          },
        },
      }),
    },
  ],
});

export const occupancyLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,

  title: "Occupancy (Structure)",
  renderer: occupancyRenderer,
  elevationInfo: {
    mode: "relative-to-scene",
  },
  popupTemplate: {
    title: "<p>{StrucID}</p>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: strucOwnerField,
            label: "Structure Owner",
          },
          {
            fieldName: municipalityField,
          },
          {
            fieldName: barangayField,
          },
          {
            fieldName: occupancyField,
            label: "<p>Status for Relocation(structure)</p>",
          },
          {
            fieldName: occupancyNameField,
          },
          {
            fieldName: nloLoStatusField,
            label: "NLO/LO Ownership",
          },
        ],
      },
    ],
  },
});

/* Pier Head and Column */
const pHeight = 0;

const pierColumn = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: pHeight + 10,
      material: {
        color: [78, 78, 78, 0.5],
      },
      edges: new SolidEdges3D({
        color: "#4E4E4E",
        size: 0.3,
      }),
    }),
  ],
});

const pileCap = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: pHeight + 3,
      material: {
        color: [200, 200, 200, 0.7],
      },
      edges: new SolidEdges3D({
        color: "#4E4E4E",
        size: 1.0,
      }),
    }),
  ],
});

const pierHeadRenderer = new UniqueValueRenderer({
  defaultSymbol: new PolygonSymbol3D({
    symbolLayers: [
      {
        type: "extrude",
        size: 5, // in meters
        material: {
          color: "#E1E1E1",
        },
        edges: new SolidEdges3D({
          color: "#4E4E4E",
          size: 1.0,
        }),
      },
    ],
  }),
  defaultLabel: "Other",
  field: "Layer",
  legendOptions: {
    title: "Pier Head/Pier Column/Pile Cap",
  },
  uniqueValueInfos: [
    {
      value: "Pier_Column",
      symbol: pierColumn,
      label: "Column",
    },
    /*
  {
    value: "Pier_Head",
    symbol: pierHead,
    label: "Pier Head"
  },
  */
    {
      value: "Pile_Cap",
      symbol: pileCap,
      label: "Pile Cap",
    },
  ],
});

export const pierHeadColumnLayer = new FeatureLayer({
  portalItem: {
    id: "876de8483da9485aac5df737cbef2143",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  title: "Pier Head/Column",
  definitionExpression: "Layer <> 'Pier_Head'",

  minScale: 150000,
  maxScale: 0,
  renderer: pierHeadRenderer,
  popupEnabled: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});
// pierHeadColumnLayer.listMode = 'hide';

/* Pier Point Layer with access dates */
const pierAccessDateColor = {
  0: [0, 255, 0, 0.9], // Accessible (green)
  1: [255, 127, 80], // Orange
  2: [255, 255, 0], // Yellow
  3: [0, 112, 255], // Blue
  4: [143, 0, 255], // violet
  5: [255, 255, 255, 0.9],
  6: [255, 0, 0, 0.9], // Dates are missing
};

//const cutOffDateAccess = '01/01/1970';
// 1. Default access label without dates
// default label without access dates
const defaultPierAccessLabel = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: valueLabelColor,
        },
        size: 15,
        font: {
          family: "Ubuntu Mono",
          weight: "bold",
        },
      }),
    ],
    verticalOffset: {
      screenLength: 80,
      maxWorldLength: 500,
      minWorldLength: 30,
    },
    callout: {
      type: "line",
      size: 0.5,
      color: [0, 0, 0],
      border: {
        color: [255, 255, 255, 0.7],
      },
    },
  }),
  labelExpressionInfo: {
    expression: "$feature.PierNumber",
    //'DefaultValue($feature.GeoTechName, "no data")'
    //"IIF($feature.Score >= 13, '', '')"
    //value: "{Type}"
  },
  labelPlacement: "above-center",
  // where: 'AccessDate IS NULL',
});

const today = new Date();
const todayn = today.getTime();
const cutOffDateAccess = todayn;
console.log(todayn, "; ", cutOffDateAccess);

const pierAccessReadyDateLabel = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: pierAccessDateColor[0],
        },
        size: 15,
        font: {
          family: "Ubuntu Mono",
          weight: "bold",
        },
      }),
    ],
    verticalOffset: {
      screenLength: 80,
      maxWorldLength: 500,
      minWorldLength: 30,
    },
    callout: {
      type: "line",
      size: 0.5,
      color: [0, 0, 0],
      border: {
        color: [255, 255, 255, 0.7],
      },
    },
  }),
  labelExpressionInfo: {
    expression: `var accessdate = $feature.AccessDate;
                  var cutoffDate = 1701300301806;
                  var labelPier = when($feature.AccessDate <= cutoffDate, $feature.PierNumber, '');
                  return \`\${labelPier}\`
                  `,
  },
  labelPlacement: "above-center",
});

const pierAccessNotYetLabel = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: "#cccccc",
        },
        size: 10,
        font: {
          family: "Ubuntu Mono",
          weight: "normal",
        },
      }),
    ],
    verticalOffset: {
      screenLength: 80,
      maxWorldLength: 500,
      minWorldLength: 30,
    },
    callout: {
      type: "line",
      size: 0.5,
      color: [0, 0, 0],
      border: {
        color: [255, 255, 255, 0.7],
      },
    },
  }),
  labelExpressionInfo: {
    expression: `var accessdate = $feature.AccessDate;
                  var cutoffDate = 1701300301806;
                  var labelPier = when($feature.AccessDate > cutoffDate || isEmpty($feature.AccessDate), $feature.PierNumber, '');
                  return \`\${labelPier}\`
                  `,
  },
  labelPlacement: "above-center",
});

const pierAccessDateMissingLabel = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: "#ff0000",
        },
        size: 10,
        font: {
          family: "Ubuntu Mono",
          weight: "normal",
        },
      }),
    ],
    verticalOffset: {
      screenLength: 80,
      maxWorldLength: 500,
      minWorldLength: 30,
    },
    callout: {
      type: "line",
      size: 0.5,
      color: [0, 0, 0],
      border: {
        color: [255, 255, 255, 0.7],
      },
    },
  }),
  labelExpressionInfo: {
    expression: "$feature.PierNumber",
    //'DefaultValue($feature.GeoTechName, "no data")'
    //"IIF($feature.Score >= 13, '', '')"
    //value: "{Type}"
  },
  labelPlacement: "above-center",
  where: "AccessDate IS NULL",
});

// 1. Get unique dates
export const pierAccessLayer = new FeatureLayer(
  {
    portalItem: {
      id: "876de8483da9485aac5df737cbef2143",
      portal: {
        url: "https://gis.railway-sector.com/portal",
      },
    },
    layerId: 6,
    labelingInfo: [defaultPierAccessLabel], //labelingInfo: [pierAccessReadyDateLabel, pierAccessNotYetLabel, pierAccessDateMissingLabel], //[pierAccessDateMissingLabel, pierAccessReadyDateLabel, pierAccessNotYetLabel],
    title: "Pier Number",
    minScale: 150000,
    maxScale: 0,

    elevationInfo: {
      mode: "on-the-ground",
    },
  }
  //{ utcOffset: 300 },
);

const pierAccessRenderer = new UniqueValueRenderer({
  field: "AccessDate",

  valueExpression:
    "When(IsEmpty($feature.AccessDate), 'empty', $feature.AccessDate <= 1636070400000, 'accessible', $feature.AccessDate > 1636070400000, 'others',$feature.AccessDate)",
  uniqueValueInfos: [
    {
      value: "empty",
      label: "Dates are missing",
      symbol: new SimpleMarkerSymbol({
        size: 5,
        color: pierAccessDateColor[6],
        outline: {
          width: 0.1,
          color: "white",
        },
      }),
    },
    {
      value: "accessible",
      label: "Accessible",
      symbol: new SimpleMarkerSymbol({
        size: 5,
        color: pierAccessDateColor[0],
        outline: {
          width: 0.1,
          color: "white",
        },
      }),
    },
    {
      value: "others",
      label: "Others",
      symbol: new SimpleMarkerSymbol({
        size: 5,
        color: pierAccessDateColor[5],
        outline: {
          width: 0.1,
          color: "white",
        },
      }),
    },
  ],
});
// pierAccessLayer.renderer = pierAccessRenderer;

// 3. Popup Template
function dateFormat(inputDate: any, format: any) {
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
}

// Custom Popup Content for pierAccessLayer
let customContent = new CustomContent({
  outFields: ["*"],
  creator: (event: any) => {
    // Extract AsscessDate of clicked pierAccessLayer
    const statsDate = event.graphic.attributes.AccessDate;

    // Convert numeric to date format
    const date = new Date(statsDate);
    let dateValue = dateFormat(date, "MM-dd-yyyy");

    // If the date is before current date, popupContent should be "AVAILABLE"
    let DATES: any;
    if (dateValue === "01-01-1970") {
      // Empty date is entered as this
      DATES = "NO DATES AVAILABLE";
    } else if (statsDate <= cutOffDateAccess) {
      DATES = "ACCESSIBLE";
    } else if (statsDate > cutOffDateAccess) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      DATES = dateValue;
    }

    //return `Access Date: <b>${DATES}</b>`;
    return `Access Date: <b>${dateValue}</b><br>
            Status: <b>${DATES}</b> 
    `;
  },
});

const template = new PopupTemplate({
  title: "Pier No: <b>{PierNumber}</b>",
  lastEditInfoEnabled: false,
  content: [customContent],
});
pierAccessLayer.popupTemplate = template;

/* Tree Cutting and Compensation Layers */
/* Tree cutting layer */
export const colorsCutting = ["#71ab48", "#ffff00", "#ffaa00", "#ff0000"];
const treeCutting3DSymbol = (name: any) => {
  return new WebStyleSymbol({
    name: name,
    styleName: "EsriThematicTreesStyle",
  });
};

const outlineColor = "gray";

const treeCuttingRenderer = new UniqueValueRenderer({
  field: treeStatusField,
  uniqueValueInfos: [
    {
      value: 1,
      label: "Cut/Earthballed",
      symbol: treeCutting3DSymbol("Larix"),
    },
    {
      value: 2,
      label: "Permit Acquired",
      symbol: treeCutting3DSymbol("Larix"),
    },
    {
      value: 3,
      label: "Submitted to DENR",
      symbol: treeCutting3DSymbol("Larix"),
    },
    {
      value: 4,
      label: "Ongoing Acquisition of Application Documents",
      symbol: treeCutting3DSymbol("Larix"),
    },
  ],
  visualVariables: [
    new SizeVariable({
      axis: "height",
      // field: 'SIZE',
      valueExpression: `When($feature.${treeStatusField} >= 1, 5, 0)`,
      valueUnit: "meters",
    }),
    new ColorVariable({
      valueExpression: `$feature.${treeStatusField}`,
      valueExpressionTitle: "Status Color",
      stops: [
        { value: 1, color: "#71AB48" },
        { value: 2, color: "#FFFF00" },
        { value: 3, color: "#FFAA00" },
        { value: 4, color: "#FF0000" },
      ],
      legendOptions: {
        title: "",
        showLegend: false,
      },
    }),
  ],
});

export const treeCuttingLayer = new FeatureLayer({
  portalItem: {
    id: "05b19f50364243dbabf06605085b09ce",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  elevationInfo: {
    mode: "on-the-ground",
  },
  layerId: 2,

  title: "Tree Cutting",
  renderer: treeCuttingRenderer,
  popupTemplate: {
    lastEditInfoEnabled: false,
    // returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: treeScientificNameField,
            label: "Scientific Name",
          },
          {
            fieldName: treeCommonNameField,
            label: "Common Name",
          },
          {
            fieldName: treeProvinceField,
          },
          {
            fieldName: treeMunicipalityField,
          },
          {
            fieldName: treeNoField,
            label: "Tree No.",
          },
          {
            fieldName: treeCpField,
            label: "<h5>CP</h5>",
          },
          {
            fieldName: treeCompensationStatusField,
            label: "Status of Tree Compensation",
          },
          {
            fieldName: treeConservationField,
            label: "Conservation Status",
          },
        ],
      },
    ],
  },
});

/* Tree compensation layer */
export const colorsCompen = ["#0070ff", "#ffff00", "#71ab48"];

const treeCompensationRenderer = new UniqueValueRenderer({
  field: treeCompensationStatusField,
  uniqueValueInfos: [
    {
      value: 1,
      label: "Non-Compensable",
      symbol: treeCutting3DSymbol("Larix"),
    },
    {
      value: 2,
      label: "For Processing",
      symbol: treeCutting3DSymbol("Larix"),
    },
    {
      value: 3,
      label: "Compensated",
      symbol: treeCutting3DSymbol("Larix"),
    },
  ],
  visualVariables: [
    new SizeVariable({
      axis: "height",
      valueExpression: `When($feature.${treeCompensationStatusField} >= 1, 5, 0)`,
      valueUnit: "meters",
    }),
    new ColorVariable({
      valueExpression: `$feature.${treeCompensationStatusField}`,
      valueExpressionTitle: "Status Color",
      legendOptions: {
        title: "",
        showLegend: false,
      },
      stops: [
        { value: 1, color: "#0070FF" },
        { value: 2, color: "#FFFF00" },
        { value: 3, color: "#71AB48" },
      ],
    }),
  ],
});

export const treeCompensationLayer = new FeatureLayer({
  portalItem: {
    id: "05b19f50364243dbabf06605085b09ce",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,

  title: "Tree Compensation",
  renderer: treeCompensationRenderer,
  popupTemplate: {
    title: "<h5>{Compensation}</h5>",
    lastEditInfoEnabled: false,
    // returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: treeScientificNameField,
            label: "Scientific Name",
          },
          {
            fieldName: treeCommonNameField,
            label: "Common Name",
          },
          {
            fieldName: treeProvinceField,
          },
          {
            fieldName: treeMunicipalityField,
          },
          {
            fieldName: treeNoField,
            label: "Tree No.",
          },
          {
            fieldName: treeCpField,
            label: "<h5>CP</h5>",
          },
          {
            fieldName: treeStatusField,
            label: "Status of Tree Cutting",
          },
          {
            fieldName: treeConservationField,
            label: "Conservation Status",
          },
        ],
      },
    ],
  },
});

/* Utility Layers */
// * Utility Point * //
function customSymbol3D(name: string) {
  return new WebStyleSymbol({
    //portal: 'https://www.maps.arcgis.com',
    // IMPORTANT: Your browser needs to be able to open the following link. It will say insecure so need to go to advanced.
    styleUrl:
      "https://www.maps.arcgis.com/sharing/rest/content/items/c04d4d4145f64f8fa38407dd5331dd1f/data",
    name: name,
  });
}

function utilPtSymbolInfra(name: string) {
  return new WebStyleSymbol({
    name: name,
    styleName: "EsriInfrastructureStyle",
  });
}

function utilPtSymbolStreet(name: string) {
  return new WebStyleSymbol({
    name: name,
    styleName: "EsriRealisticStreetSceneStyle",
  });
}

const verticalOffsetRelocation = {
  screenLength: 10,
  maxWorldLength: 30,
  minWorldLength: 35,
};

// Function that automatically creates the symbol for the points of interest
function getUniqueValueSymbol(name: string, color: any, sizeS: number) {
  return new PointSymbol3D({
    symbolLayers: [
      new IconSymbol3DLayer({
        resource: {
          href: name,
        },
        size: sizeS,
        outline: {
          color: color,
          size: 2,
        },
      }),
    ],

    verticalOffset: verticalOffsetRelocation,

    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: [128, 128, 128, 0.1],
      size: 0.2,
      border: {
        color: "grey",
      },
    },
  });
}

const utilPointSymbolRenderer = new UniqueValueRenderer({
  field: utilityType2Field,
  // "When($feature.UtilType2 == 1, 'Telecom Pole (BTS)', \
  //                     $feature.UtilType2 == 2, 'Telecom Pole (CATV)', \
  //                     $feature.UtilType2 == 3, 'Water Meter', \
  //                     $feature.UtilType2 == 4, 'Water Valve', \
  //                     $feature.UtilType2 == 5, 'Manhole', \
  //                     $feature.UtilType2 == 6, 'Drain Box', \
  //                     $feature.UtilType2 == 7, 'Electric Pole', \
  //                     $feature.UtilType2 == 8, 'Street Light', \
  //                     $feature.UtilType2 == 9, 'Junction Box', \
  //                     $feature.UtilType2 == 10, 'Coupling', \
  //                     $feature.UtilType2 == 11, 'Fitting', \
  //                     $feature.UtilType2 == 12, 'Transformer', \
  //                     $feature.UtilType2 == 13, 'Truss Guy', \
  //                     $feature.UtilType2 == 14, 'Concrete Pedestal', \
  //                     $feature.UtilType2 == 15, 'Ground', \
  //                     $feature.UtilType2 == 16, 'Down Guy', \
  //                     $feature.UtilType2 == 17, 'Entry/Exit Pit', \
  //                     $feature.UtilType2 == 18, 'Handhole', \
  //                     $feature.UtilType2 == 19, 'Transmission Tower', \
  //                     $feature.UtilType)",
  uniqueValueInfos: [
    {
      value: 1,
      symbol: customSymbol3D("3D_Telecom_BTS"),
    },
    {
      value: 2,
      symbol: customSymbol3D("3D_TelecomCATV_Pole"),
    },
    {
      value: 5,
      symbol: utilPtSymbolStreet("Storm_Drain"),
    },
    {
      value: 7,
      //symbol: utilPtSymbolInfra("Powerline_Pole")
      symbol: customSymbol3D("3D_Electric_Pole"),
    },
    {
      value: 8,
      symbol: utilPtSymbolStreet("Overhanging_Street_and_Sidewalk_-_Light_on"),
    },
    {
      value: 9,
      symbol: customSymbol3D("3D_Drain_Box"),
    },
    {
      value: 10,
      symbol: customSymbol3D("3D_Drain_Box"),
    },
    {
      value: 11,
      symbol: customSymbol3D("3D_Drain_Box"),
    },
    {
      value: 12,
      symbol: customSymbol3D("3D_Drain_Box"),
    },
    {
      value: 13,
      symbol: customSymbol3D("3D_Drain_Box"),
    },
    {
      value: 14,
      symbol: customSymbol3D("Concrete Pedestal"),
    },
    {
      value: 15,
      symbol: customSymbol3D("3D_Drain_Box"),
    },
    {
      value: 16,
      symbol: customSymbol3D("3D_Drain_Box"),
    },
    {
      value: 17,
      symbol: customSymbol3D("3D_Drain_Box"),
    },
    {
      value: 18,
      symbol: customSymbol3D("3D_Drain_Box"),
    },
    {
      value: 19,
      symbol: utilPtSymbolInfra("Powerline_Pole"),
    },
  ],
  visualVariables: [
    new SizeVariable({
      axis: "height",
      field: "SIZE",
      valueUnit: "meters",
    }),
    new RotationVariable({
      field: "ROTATION",
    }),
  ],
});

export const utilityPointLayer = new FeatureLayer({
  portalItem: {
    id: "7507e625f480470a9af257d60cf67c1c",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  title: "Point (symbol)",

  renderer: utilPointSymbolRenderer,
  elevationInfo: {
    mode: "relative-to-ground", // original was "relative-to-scene"
    featureExpressionInfo: {
      expression: `$feature.${utilityHeightField}`,
    },
    unit: "meters",
    //offset: 0
  },
  popupTemplate: {
    title: "<h5>{comp_agency}</h5>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: utilityIdField,
          },
          {
            fieldName: utilityTypeField,
            label: "Utility Type",
          },
          {
            fieldName: utilityType2Field,
            label: "Utility Name",
          },
          {
            fieldName: utilityActionField,
            label: "<h5>Action</h5>",
          },
          {
            fieldName: utilityStatusField,
            label: "<h5>Status</h5>",
          },
          {
            fieldName: utilityCpField,
          },
          {
            fieldName: utilityRemarksField,
          },
        ],
      },
    ],
  },
});

const utilityStatusRenderer = new UniqueValueRenderer({
  valueExpression:
    // eslint-disable-next-line no-multi-str
    // `When($feature.${utilityRemarksField} == 'pending', 'NoAction', \
    //       $feature.${utilityStatusField} == 1 && $feature.${utilityActionField} == 1, 'DemolishComplete',\
    //       $feature.${utilityStatusField} == 0 && $feature.${utilityActionField} == 1, 'DemolishIncomplete',\
    //       $feature.${utilityStatusField} == 0 && $feature.${utilityActionField} == 2, 'RelocIncomplete', \
    //       $feature.${utilityStatusField} == 1 && $feature.${utilityActionField} == 2, 'RelocComplete', \
    //       $feature.${utilityStatusField} == 0 && $feature.${utilityActionField} == 3, 'NewlyAdded', \
    //       $feature.${utilityStatusField} == 1 && $feature.${utilityActionField}== 3, 'NewlyAddedComplete',$feature.${utilityCompanyField})
    //       )`,
    "When($feature.Remarks == 'pending', 'NoAction', \
                      $feature.Status == 1 && $feature.LAYER == 1, 'DemolishComplete',\
                      $feature.Status == 0 && $feature.LAYER == 1, 'DemolishIncomplete',\
                      $feature.Status == 0 && $feature.LAYER == 2, 'RelocIncomplete', \
                      $feature.Status == 1 && $feature.LAYER == 2, 'RelocComplete', \
                      $feature.Status == 0 && $feature.LAYER == 3, 'NewlyAdded', \
                      $feature.Status == 1 && $feature.LAYER == 3, 'NewlyAddedComplete',$feature.Comp_Agency)",
  uniqueValueInfos: [
    {
      value: "DemolishIncomplete",
      label: "To be Demolished",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Demolished.png",
        "#D13470",
        20
      ),
    },
    {
      value: "DemolishComplete",
      label: "Demolision Completed",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/DemolishComplete_v2.png",
        "#D13470",
        25
      ),
    },
    {
      value: "RelocIncomplete",
      label: "Proposed Relocation",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Relocatd.png",
        "#D13470",
        30
      ),
    },
    {
      value: "RelocComplete",
      label: "Relocation Completed",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Utility_Relocated_Completed_Symbol.png",
        "#D13470",
        30
      ),
    },
    {
      value: "NewlyAdded",
      label: "Add New Utility",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/NewlyAdded.png",
        "#D13470",
        35
      ),
    },
    {
      value: "NewlyAddedComplete",
      label: "Newly Utility Added",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/NewlyAdded_Completed.png",
        "#D13470",
        35
      ),
    },
    {
      value: "NoAction",
      label: "Require Data Checking",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Unknown_v2.png",
        "#D13470",
        35
      ),
    },
  ],
});

const utilPointStatusTextSymbol = labelSymbol3DLine({
  materialColor: "white",
  fontSize: 10,
  haloColor: [0, 0, 0, 0.7],
  haloSize: 0.4,
});

const utilPointStatusLabel = new LabelClass({
  labelPlacement: "above-center",
  labelExpressionInfo: {
    //value: "{Company}",
    expression:
      "When($feature.Status >= 0, DomainName($feature, 'Comp_Agency'), '')", //$feature.Comp_Agency
  },
  symbol: utilPointStatusTextSymbol,
});

export const utilityPointLayer1 = new FeatureLayer({
  portalItem: {
    id: "7507e625f480470a9af257d60cf67c1c",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  title: "Point (status)",

  renderer: utilityStatusRenderer,
  elevationInfo: {
    mode: "relative-to-ground", // original was "relative-to-scene"
    featureExpressionInfo: {
      expression: "$feature.Height",
    },
    unit: "meters",
    //offset: 0
  },
  labelingInfo: [utilPointStatusLabel],
  popupTemplate: {
    title: "<h5>{comp_agency}</h5>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Id",
          },
          {
            fieldName: "UtilType",
            label: "Utility Type",
          },
          {
            fieldName: "UtilType2",
            label: "Utility Name",
          },
          {
            fieldName: "LAYER",
            label: "<h5>Action</h5>",
          },
          {
            fieldName: "Status",
            label: "<h5>Status</h5>",
          },
          {
            fieldName: "CP",
          },
          {
            fieldName: "Remarks",
          },
        ],
      },
    ],
  },
});

// * Utility Line * //
const utilLineStatusRenderer = new UniqueValueRenderer({
  valueExpression:
    // eslint-disable-next-line no-multi-str
    "When($feature.Remarks == 'pending', 'NoAction', \
                        $feature.Status == 1 && $feature.LAYER == 1, 'DemolishComplete',\
                        $feature.Status == 0 && $feature.LAYER == 1, 'DemolishIncomplete',\
                        $feature.Status == 0 && $feature.LAYER == 2, 'RelocIncomplete', \
                        $feature.Status == 1 && $feature.LAYER == 2, 'RelocComplete', \
                        $feature.Status == 0 && $feature.LAYER == 3, 'NewlyAdded', \
                        $feature.Status == 1 && $feature.LAYER == 3, 'NewlyAddedComplete',$feature.Comp_Agency)",
  //field: "Company",
  uniqueValueInfos: [
    {
      value: "DemolishIncomplete",
      label: "To be Demolished",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Demolished.png",
        "#D13470",
        20
      ),
    },
    {
      value: "DemolishComplete",
      label: "Demolision Completed",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/DemolishComplete_v2.png",
        "#D13470",
        25
      ),
    },
    {
      value: "RelocIncomplete",
      label: "Proposed Relocation",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Relocatd.png",
        "#D13470",
        30
      ),
    },
    {
      value: "RelocComplete",
      label: "Relocation Completed",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Utility_Relocated_Completed_Symbol.png",
        "#D13470",
        30
      ),
    },
    {
      value: "NewlyAdded",
      label: "Add New Utility",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/NewlyAdded.png",
        "#D13470",
        35
      ),
    },
    {
      value: "NewlyAddedComplete",
      label: "Newly Utility Added",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/NewlyAdded_Completed.png",
        "#D13470",
        35
      ),
    },
    {
      value: "NoAction",
      label: "Require Data Checking",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Unknown_v2.png",
        "#D13470",
        35
      ),
    },
  ],
});

export const utilityLineLayer = new FeatureLayer({
  portalItem: {
    id: "7507e625f480470a9af257d60cf67c1c",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  title: "Line (symbol)", // Relocation PLan?
  elevationInfo: {
    mode: "relative-to-ground", // original was "relative-to-scene"
    featureExpressionInfo: {
      expression: "$feature.height",
    },
    unit: "meters",
    //offset: 0
  },

  popupTemplate: {
    title: "<h5>{comp_agency}</h5>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Id",
          },
          {
            fieldName: "UtilType",
            label: "Utility Type",
          },
          {
            fieldName: "UtilType2",
            label: "Utility Name",
          },
          {
            fieldName: "LAYER",
            label: "<h5>Action</h5>",
          },
          {
            fieldName: "Status",
            label: "<h5>Status</h5>",
          },
          {
            fieldName: "CP",
          },
          {
            fieldName: "Remarks",
          },
        ],
      },
    ],
  },
});

const utilLineColor = [
  [32, 178, 170, 0.5], //Telecom Line
  [112, 128, 144, 0.5], // Internet Cable Line
  [0, 128, 255, 0.5], // Water Distribution Pipe
  [224, 224, 224, 0.5], // Sewage
  [105, 105, 105, 0.5], // Drainage
  [205, 133, 63, 0.5], // Canal
  [139, 69, 19, 0.5], // Creek
  [211, 211, 211, 0.5], // Electric Line
  [0, 128, 255, 0.5], // Duct Bank
  [0, 128, 255, 0.5], // Water line
  [0, 128, 255, 0.5], // Gas Line
];

function lineSizeShapeSymbolLayers(
  profile: "circle" | "quad" | undefined,
  cap: "round" | "none" | "butt" | "square" | undefined,
  join: "round" | "miter" | "bevel" | undefined,
  width: number,
  height: number,
  profileRotation: "heading" | "all" | undefined,
  property: number
) {
  return new LineSymbol3D({
    symbolLayers: [
      new PathSymbol3DLayer({
        profile: profile,
        material: {
          color: utilLineColor[property],
        },
        width: width,
        height: height,
        join: join,
        cap: cap,
        anchor: "bottom",
        profileRotation: profileRotation,
      }),
    ],
  });
}

function renderutilityLineLayer() {
  const renderer = new UniqueValueRenderer({
    field: "utiltype2",
  });

  for (var i = 1; i <= utilLineColor.length; i++) {
    renderer.addUniqueValueInfo({
      value: i,
      symbol: lineSizeShapeSymbolLayers(
        "circle",
        "none",
        "miter",
        0.5,
        0.5,
        "all",
        i - 1
      ),
    });
  }
  utilityLineLayer.renderer = renderer;
}

renderutilityLineLayer();

const utilLineStatusTextSymbol = labelSymbol3DLine({
  materialColor: "black",
  fontSize: 10,
  haloColor: [255, 255, 255, 0.7],
  haloSize: 0.7,
});

const utilityLineLabelClass = new LabelClass({
  //labelPlacement: 'above-center', // Polyline has not choice
  labelExpressionInfo: {
    expression:
      "When($feature.Status >= 0, DomainName($feature, 'Comp_Agency'), '')",
  },
  symbol: utilLineStatusTextSymbol,
});

////
// NGCR Utility line between P178 and P229
const utilityLineLabelClassNGCP = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: "#e8ff00ff",
        },
        size: 16,
        halo: {
          color: "black",
          size: 1,
        },
        font: {
          family: "Ubuntu Mono",
          weight: "bold",
        },
      }),
    ],
    verticalOffset: {
      screenLength: 120,
      maxWorldLength: 700,
      minWorldLength: 25,
      // screenLength: 80,
      // maxWorldLength: 500,
      // minWorldLength: 30,
    },
    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: "grey",
      size: 1,
      border: {
        color: "grey",
      },
    },
  }),
  labelPlacement: "above-center", // Polyline has not choice
  labelExpressionInfo: {
    expression: `$feature.Company + " (P178-P229)"`,
  },
});

export const utilityLineNGCP = new FeatureLayer({
  portalItem: {
    id: "3dbd0454687a4100905ce7222299e43d",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  title: "NGCP Line",
  elevationInfo: {
    mode: "on-the-ground",
  },
  labelingInfo: [utilityLineLabelClassNGCP],
});

function renderutilityLineNGCP() {
  const renderer = new UniqueValueRenderer({
    field: "utiltype2",
  });
  renderer.addUniqueValueInfo({
    value: 8,
    label: "P178 - P229",
    symbol: lineSizeShapeSymbolLayers(
      "circle",
      "none",
      "miter",
      2.5,
      2.5,
      "all",
      8 - 1
    ),
  });
  utilityLineNGCP.renderer = renderer;
}

renderutilityLineNGCP();

//////////////////////

export const utilityLineLayer1 = new FeatureLayer({
  portalItem: {
    id: "7507e625f480470a9af257d60cf67c1c",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  title: "Line (status)",
  elevationInfo: {
    mode: "relative-to-ground", // original was "relative-to-scene"
    featureExpressionInfo: {
      expression: "$feature.height",
    },
    unit: "meters",
    //offset: 0
  },

  renderer: utilLineStatusRenderer,
  labelingInfo: [utilityLineLabelClass],
  popupTemplate: {
    title: "<h5>{comp_agency}</h5>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Id",
          },
          {
            fieldName: "UtilType",
            label: "Utility Type",
          },
          {
            fieldName: "UtilType2",
            label: "Utility Name",
          },
          {
            fieldName: "LAYER",
            label: "<h5>Action</h5>",
          },
          {
            fieldName: "Status",
            label: "<h5>Status</h5>",
          },
          {
            fieldName: "CP",
          },
          {
            fieldName: "Remarks",
          },
        ],
      },
    ],
  },
});

/* Viaduct */

/* Launching girder */
const launchingGirderLabelClass = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: "red",
        },
        size: 14,
        halo: {
          color: "black",
          size: 1,
        },
        font: {
          family: "Ubuntu Mono",
          weight: "bold",
        },
      }),
    ],
    verticalOffset: {
      screenLength: 45,
      maxWorldLength: 120,
      minWorldLength: 25,
    },
    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: "red",
      size: 1,
      border: {
        color: "grey",
      },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.LAYER",
    //value: "{TEXTSTRING}"
  },
});

export const launchingGirderLayer = new FeatureLayer({
  portalItem: {
    id: "876de8483da9485aac5df737cbef2143",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 6,
  labelingInfo: [launchingGirderLabelClass],
  elevationInfo: {
    mode: "on-the-ground", //absolute-height, relative-to-ground
  },
  title: "Girder Launcher Location",

  definitionExpression: "LAYER IS NOT NULL",
});

// * Viaduct * //
const colorViaduct = [
  [225, 225, 225, 0.1], // To be Constructed (white)
  [130, 130, 130, 0.5], // Under Construction
  [255, 0, 0, 0.8], // Delayed
  [0, 112, 255, 0.8], // Completed
];

const viaduct_renderer = new UniqueValueRenderer({
  field: "Status",
  uniqueValueInfos: [
    {
      value: 1,
      label: "To be Constructed",
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: [225, 225, 225, 0.1],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
    {
      value: 4,
      label: "Completed",
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: [0, 112, 255, 0.8],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
  ],
});

export const viaductLayer = new SceneLayer({
  portalItem: {
    id: "3c112d7fe610486eaf4df3eac07d3ea0",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  elevationInfo: {
    mode: "absolute-height", //absolute-height, relative-to-ground
  },
  title: "Viaduct",
  renderer: viaduct_renderer,
  labelsVisible: false,
});

/* Building Scene Layer for station structures */
export const buildingLayer = new BuildingSceneLayer({
  portalItem: {
    id: "a1f0981f5fac47c5b1d1e8ca80abc118",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  outFields: ["Category", "Status", "BldgLevel", "StructureLevel", "Types"],
  title: "Station Structures",
});
// buildingLayer.listMode = 'hide';

// Discipline: Architectural
export let columnsLayer: null | any;
export let floorsLayer: null | any;
export let wallsLayer: null | any;

// Discipline: Structural
export let stFramingLayer: null | any;
export let stColumnLayer: null | any;
export let stFoundationLayer: null | any;

export let exteriorShellLayer: null | any;

export const popuTemplate = {
  title: "{Station}",
  content: [
    {
      type: "fields",
      fieldInfos: [
        {
          fieldName: "Status",
          label: "Construction Status",
        },
        {
          fieldName: "Category",
          label: "Category",
        },
        {
          fieldName: "Status",
          label: "Construction Status",
        },
        {
          fieldName: "BldgLevel",
          label: "Building Level",
        },
      ],
    },
  ],
};

const colorStatus = [
  [225, 225, 225, 0.1], // To be Constructed (white)
  [130, 130, 130, 0.5], // Under Construction
  [255, 0, 0, 0.8], // Delayed
  [0, 112, 255, 0.8], // Completed
];

const renderer = new UniqueValueRenderer({
  field: "Status",
  uniqueValueInfos: [
    {
      value: 1,
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: colorStatus[0],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
    {
      value: 2,
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: colorStatus[1],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
    {
      value: 4,
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: colorStatus[3],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
  ],
});

buildingLayer.when(() => {
  buildingLayer.allSublayers.forEach((layer: any) => {
    switch (layer.modelName) {
      case "FullModel":
        layer.visible = true;
        break;

      case "Overview":
        exteriorShellLayer = layer;
        exteriorShellLayer.visible = false;
        break;

      case "Columns":
        columnsLayer = layer;
        columnsLayer.popupTemplate = popuTemplate;
        columnsLayer.renderer = renderer;
        //excludedLayers.push(layer);
        break;

      case "Floors":
        floorsLayer = layer;
        floorsLayer.popupTemplate = popuTemplate;
        floorsLayer.renderer = renderer;
        //excludedLayers
        break;

      case "Walls":
        wallsLayer = layer;
        wallsLayer.popupTemplate = popuTemplate;
        wallsLayer.renderer = renderer;
        break;

      case "StructuralFraming":
        stFramingLayer = layer;
        stFramingLayer.popupTemplate = popuTemplate;
        stFramingLayer.renderer = renderer;
        break;

      case "StructuralColumns":
        stColumnLayer = layer;
        stColumnLayer.popupTemplate = popuTemplate;
        stColumnLayer.renderer = renderer;
        break;

      case "StructuralFoundation":
        stFoundationLayer = layer;
        stFoundationLayer.popupTemplate = popuTemplate;
        stFoundationLayer.renderer = renderer;
        break;

      default:
        layer.visible = true;
    }
  });
});

// Group layers //
export const alignmentGroupLayer = new GroupLayer({
  title: "Alignment",
  visible: true,
  visibilityMode: "independent",
  layers: [stationLayer, stationBoxLayer, pierHeadColumnLayer, chainageLayer],
});

export const nloLoOccupancyGroupLayer = new GroupLayer({
  title: "NLO/LO Occupancy",
  visible: false,
  visibilityMode: "independent",
  layers: [occupancyLayer, strucOwnershipLayer, nloLayer],
});

export const lotGroupLayer = new GroupLayer({
  title: "Land",
  visible: true,
  visibilityMode: "independent",
  layers: [endorsedLotLayer, lotLayer, pnrLayer],
});

export const ngcp2_groupLayer = new GroupLayer({
  title: "NGCP Site 2",
  visible: false,
  visibilityMode: "independent",
  layers: [ngcp_tagged_structureLayer, ngcp_working_area],
});

export const treeGroupLayer = new GroupLayer({
  title: "Tree Cutting & Compensation",
  visible: false,
  visibilityMode: "independent",
  layers: [treeCuttingLayer, treeCompensationLayer],
});

export const utilityGroupLayer = new GroupLayer({
  title: "Utility Relocation",
  visible: false,
  visibilityMode: "independent",
  layers: [
    utilityLineLayer1,
    utilityLineLayer,
    utilityPointLayer1,
    utilityPointLayer,
    utilityLineNGCP,
  ],
});

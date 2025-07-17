export const construction_status = [
  "To be Constructed",
  "Under Construction",
  "Completed",
];

// chart width
export const chard_width = "26vw";

// Updated Dates
export const updatedDateCategoryNames = [
  "Land Acquisition",
  "Structure",
  "Non Land Owner",
  "Utility Relocation",
  "Trees",
  "Viaduct",
];
export const cutoff_days = 30;

// Lot Status
export const superUrgentField = "Urgent";
export const querySuperUrgent = `${superUrgentField} = 0`;
export const superurgent_items = ["OFF", "ON"];

export const lotHandOverDateField = "HandOverDate";
export const lotTargetActualField = "TargetActual";
export const lotTargetActualDateField = "TargetActualDate";

export const lotStatusField = "StatusLA";
export const lotIdField = "LotID";
export const percentHandedOverField = "percentHandedOver";
export const municipalityField = "Municipality";
export const barangayField = "Barangay";
export const landOwnerField = "LandOwner";
export const cpField = "CP";
export const landUseField = "LandUse";
export const endorsedField = "Endorsed";
export const handedOverLotField = "HandedOver";
export const lotHandedOverDateField = "HandedOverDate";
export const lotHandedOverAreaField = "HandedOverArea";
export const affectedAreaField = "AffectedArea";
export const statusLotLabel = [
  "Paid",
  "For Payment Processing",
  "For Legal Pass",
  "For Offer to Buy",
  "For Notice of Taking",
  "With PTE",
  "For Expropriation",
];

// export const statusLotColor = ['#00734d', '#0070ff', '#ffff00', '#ffaa00', '#ff0000'];
export const statusLotColor = [
  "#00734d",
  "#0070ff",
  "#ffff00",
  "#ffaa00",
  "#FF5733",
  "#70AD47",
  "#FF0000",
];

export const statusLotQuery = statusLotLabel.map((status, index) => {
  return Object.assign({
    category: status,
    value: index + 1,
    color: statusLotColor[index],
  });
});

// Chart and chart label color
export const primaryLabelColor = "#9ca3af";
export const valueLabelColor = "#d1d5db";

// Structure //
export const structureStatusField = "StatusStruc";
export const familyNumberField = "FamilyNumber";

export const statusStructureLabel = [
  "Demolished",
  "Paid",
  "For Payment Processing",
  "For Legal Pass",
  "For Offer to Compensate",
  "For Notice of Taking",
  "No Need to Acquire",
];

export const statusStructureColorHex = [
  "#00C5FF",
  "#70AD47",
  "#0070FF",
  "#FFFF00",
  "#FFAA00",
  "#FF5733", //'#FF0000',
  "#B2BEB5",
];
export const statusStructureColorRgb = [
  [0, 197, 255, 0.6],
  [112, 173, 71, 0.6],
  [0, 112, 255, 0.6],
  [255, 255, 0, 0.6],
  [255, 170, 0, 0.6],
  [255, 87, 51, 0.6], //[255, 0, 0, 0.6],
  [178, 190, 181, 0.6],
];

export const statusStructureQuery = statusStructureLabel.map(
  (status, index) => {
    return Object.assign({
      category: status,
      value: index + 1,
      colorLayer: statusStructureColorRgb[index],
      color: statusStructureColorHex[index],
    });
  }
);

// NLO
export const occupancyField = "Occupancy";
export const nloLoStatusField = "Status";
export const structureIdField = "StrucID";
export const nloStatusField = "StatusRC";
export const statusNloLabel = [
  "Relocated",
  "Paid",
  "For Payment Processing",
  "For Legal Pass",
  "For Appraisal/OtC/Requirements for Other Entitlements",
  "LBP Account Opening",
];
export const statusNloColor = [
  "#00C5FF",
  "#70AD47",
  "#0070FF",
  "#FFFF00",
  "#FFAA00",
  "#FF0000",
];

export const statusNloSymbolRef = [
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_Relocated.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_Paid.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_PaymentProcess.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_LegalPass.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_OtC.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_LBP.svg",
];

export const statusNloQuery = statusNloLabel.map((status, index) => {
  return Object.assign({
    category: status,
    value: index + 1,
    color: statusNloColor[index],
  });
});

// Structure Ownership
export const statusStructureOwnershipLabel = [
  "LO (Land Owner)",
  "NLO (Non-Land Owner)",
];
export const statusStructureOwnershipColor = [
  [128, 128, 128, 1],
  [128, 128, 128, 1],
];

// Structure Occupancy
export const strucOwnerField = "StrucOwner";
export const occupancyNameField = "Name";
export const statusStructureOccupancyLabel = ["Occupied", "Relocated"];
export const statusStructureOccupancyRef = [
  "https://EijiGorilla.github.io/Symbols/Demolished.png",
  "https://EijiGorilla.github.io/Symbols/DemolishComplete_v2.png",
];

////////////// Tree cutting & Compensation ////////////////////////
export const treeStatusField = "Status";
export const treeScientificNameField = "ScientificName";
export const treeCommonNameField = "ScientificName";
export const treeProvinceField = "Province";
export const treeMunicipalityField = "Municipality";
export const treeNoField = "TreeNo";
export const treeCpField = "CP";
export const treeCompensationStatusField = "Compensation";
export const treeConservationField = "Conservation";

////////////// Utility Relocation ////////////////////////
export const utilityCompanyField = "Comp_Agency";
export const utilityRemarksField = "Remarks";
export const utilityCpField = "CP";
export const utilityStatusField = "Status";
export const utilityIdField = "Id";
export const utilityActionField = "LAYER";
export const utilityTypeField = "UtilType";
export const utilityType2Field = "UtilType2";
export const utilityHeightField = "Height";
export const utilityType2SymbolList = [
  {
    utilType2: 1,
    name: "Telecom Pole (BTS)",
  },
  {
    utilType2: 2,
    name: "Telecom Pole (CATV)",
  },
  {
    utilType2: 3,
    name: "Water Meter",
  },
  {
    utilType2: 4,
    name: "Water Valve",
  },
  {
    utilType2: 5,
    name: "Manhole",
  },
  {
    utilType2: 6,
    name: "Drain Box",
  },
  {
    utilType2: 7,
    name: "Electric Pole",
  },
  {
    utilType2: 8,
    name: "Street Light",
  },
  {
    utilType2: 9,
    name: "Junction Box",
  },
  {
    utilType2: 10,
    name: "Coupling",
  },
  {
    utilType2: 11,
    name: "Fitting",
  },
  {
    utilType2: 12,
    name: "Transformer",
  },
  {
    utilType2: 13,
    name: "Truss Guy",
  },
  {
    utilType2: 14,
    name: "Concrete Pedestal",
  },
  {
    utilType2: 15,
    name: "Ground",
  },
  {
    utilType2: 16,
    name: "Down Guy",
  },
  {
    utilType2: 17,
    name: "Entry/Exit Pit",
  },
  {
    utilType2: 18,
    name: "Handhole",
  },
  {
    utilType2: 19,
    name: "Transmission Tower",
  },
];

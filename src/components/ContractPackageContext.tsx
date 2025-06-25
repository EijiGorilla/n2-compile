import { useState, use } from "react";
import "../index.css";
import "../App.css";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";

import {
  CalciteSegmentedControl,
  CalciteSegmentedControlItem,
} from "@esri/calcite-components-react";
import { MyContext } from "../App";
import { contractPackage } from "../Query";

export default function StationSegmentedList() {
  const { updateContractPackage } = use(MyContext);

  const [contractPackageSelected, setContractPackageSelected] = useState<any>(
    contractPackage[0]
  );

  return (
    <>
      <CalciteSegmentedControl
        onCalciteSegmentedControlChange={(event: any) => {
          setContractPackageSelected(event.target.selectedItem.id);
          updateContractPackage(event.target.selectedItem.id);
        }}
        scale="m"
        width="full"
        style={{
          width: "350px",
          marginRight: "80px",
          // marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        {contractPackageSelected &&
          contractPackage.map((contractp: any, index: any) => {
            return (
              <CalciteSegmentedControlItem
                {...(contractPackageSelected === contractp
                  ? { checked: true }
                  : {})}
                key={index}
                value={contractp}
                id={contractp}
              >
                {contractp}
              </CalciteSegmentedControlItem>
            );
          })}
      </CalciteSegmentedControl>
    </>
  );
}

import { ReactNode, createContext, useContext, useState, use } from "react";
import "../App.css";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";
import {
  CalciteSegmentedControl,
  CalciteSegmentedControlItem,
} from "@esri/calcite-components-react";
import { primaryLabelColor, superurgent_items } from "../StatusUniqueValues";
import { MyContext } from "../App";

export default function SuperUrgentSegmentedList() {
  const { updateSuperurgentSwitch } = use(MyContext);
  const [superUrgentSelected, setSuperUrgentSelected] = useState<any>(
    superurgent_items[0]
  );

  return (
    <>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <div
          style={{
            marginLeft: "15px",
            fontSize: "15px",
            color: primaryLabelColor,
            marginTop: "auto",
            marginBottom: "auto",
            marginRight: "10px",
          }}
        >
          Super Urgent Lot:{" "}
        </div>
        <CalciteSegmentedControl
          onCalciteSegmentedControlChange={(event: any) => {
            setSuperUrgentSelected(event.target.selectedItem.id);
            updateSuperurgentSwitch(event.target.selectedItem.id);
          }}
          scale="s"
          width="full"
          style={{
            width: "250px",
            // marginRight: "80px",
            // marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          {superUrgentSelected &&
            superurgent_items.map((button: any, index: any) => {
              return (
                <CalciteSegmentedControlItem
                  {...(superUrgentSelected === button ? { checked: true } : {})}
                  key={index}
                  value={button}
                  id={button}
                >
                  {button}
                </CalciteSegmentedControlItem>
              );
            })}
        </CalciteSegmentedControl>
      </div>
    </>
  );
}

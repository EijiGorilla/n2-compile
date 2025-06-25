import React, { createContext, useState } from "react";
import "./App.css";
import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { CalciteShell } from "@esri/calcite-components-react";
import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import UndergroundSwitch from "./components/UndergroundSwitch";
import { contractPackage } from "./Query";
import { superurgent_items } from "./StatusUniqueValues";
import MainChart from "./components/MainChart";

type MyDropdownContextType = {
  contractpackages: any;
  updateContractPackage: any;
  superurgentswitch: any;
  updateSuperurgentSwitch: any;
};

const initialState = {
  contractpackages: undefined,
  updateContractPackage: undefined,
  superurgentswitch: undefined,
  updateSuperurgentSwitch: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});

function App() {
  const [contractpackages, setContractpackages] = useState<any>(
    contractPackage[0]
  );

  const updateContractPackage = (newContractpackage: any) => {
    setContractpackages(newContractpackage);
  };

  const [superurgentswitch, setSuperurgentSwitch] = useState<any>(
    superurgent_items[0]
  );
  const updateSuperurgentSwitch = (newSuperurgentButton: any) => {
    setSuperurgentSwitch(newSuperurgentButton);
  };

  return (
    <div>
      <CalciteShell>
        <MyContext
          value={{
            contractpackages,
            updateContractPackage,
            superurgentswitch,
            updateSuperurgentSwitch,
          }}
        >
          <ActionPanel />
          <UndergroundSwitch />
          <MapDisplay />
          <MainChart />
          <Header />
        </MyContext>
      </CalciteShell>
    </div>
  );
}

export default App;

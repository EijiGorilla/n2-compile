import ContractPackageDisplay from "./ContractPackageContext";

function Header() {
  return (
    <>
      <header
        slot="header"
        id="headerDiv"
        style={{
          display: "flex",
          height: "70px",
          padding: "0 1rem",
          borderStyle: "solid",
          borderRightWidth: 5,
          borderLeftWidth: 5,
          borderBottomWidth: 5,
          borderTopWidth: 5,
          borderColor: "#555555",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/Projec_Logo/DOTr_Logo_v2.png"
          alt="DOTr Logo"
          height={"55px"}
          width={"55px"}
          style={{ marginBottom: "auto", marginTop: "auto" }}
        />
        <b className="headerTitle" style={{ width: "30%" }}>
          N2 Overall Progress
        </b>

        {/* Contract Package Segmented List */}
        <ContractPackageDisplay />

        <img
          src="https://EijiGorilla.github.io/Symbols/Projec_Logo/GCR LOGO.png"
          alt="GCR Logo"
          height={"50px"}
          width={"75px"}
          style={{
            marginBottom: "auto",
            marginTop: "auto",
            marginLeft: "0.5rem",
            marginRight: "2rem",
          }}
        />
      </header>
    </>
  );
}

export default Header;

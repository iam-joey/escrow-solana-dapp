import React from "react";
import DeskTopNavBar from "./NavBar";
import MobileNavbar from "./MobileNav";

function MainNavBar() {
  return (
    <header>
      <DeskTopNavBar />
      <MobileNavbar />
    </header>
  );
}

export default MainNavBar;

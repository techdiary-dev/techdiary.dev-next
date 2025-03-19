import Link from "next/link";
import React from "react";
import DarkLogo from "../logos/DarkLogo";
import SearchInput from "./SearchInput";

interface NavbarProps {
  Trailing?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ Trailing }) => {
  return (
    <div className="navbar app-border-color">
      <div className="navbar__inner wrapper">
        <div className="navbar__left">
          {Trailing}
          <Link href="/">
            <DarkLogo className={"navbar__logo"} />
          </Link>
        </div>

        <SearchInput />
        {/* <NavbarAction /> */}
      </div>
    </div>
  );
};

export default Navbar;

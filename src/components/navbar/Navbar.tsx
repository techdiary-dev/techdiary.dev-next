import Link from "next/link";
import DarkLogo from "../logos/DarkLogo";
import NavbarAction from "./NavbarAction";
import SearchInput from "./SearchInput";
import React from "react";

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
        <NavbarAction />
      </div>
    </div>
  );
};

export default Navbar;

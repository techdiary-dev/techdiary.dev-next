import Link from "next/link";
import DarkLogo from "../logos/DarkLogo";
import NavbarAction from "./NavbarAction";
import SearchInput from "./SearchInput";

const Navbar = () => {
  return (
    <div className="navbar app-border-color">
      <div className="navbar__inner wrapper">
        <div className="navbar__left">
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

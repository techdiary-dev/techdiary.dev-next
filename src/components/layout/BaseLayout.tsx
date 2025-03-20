import React, { PropsWithChildren } from "react";
import Navbar from "../Navbar/Navbar";

interface Props {
  NavbarTrailing?: React.ReactNode;
}

const BaseLayout: React.FC<PropsWithChildren<Props>> = ({
  children,
  NavbarTrailing,
}) => {
  return (
    <>
      <Navbar Trailing={NavbarTrailing} />
      <main>{children}</main>
    </>
  );
};

export default BaseLayout;

import React, { PropsWithChildren } from "react";
import Navbar from "../Navbar/Navbar";

const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default BaseLayout;

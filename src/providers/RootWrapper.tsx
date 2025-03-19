import React, { PropsWithChildren } from "react";

const RootWrapper: React.FC<PropsWithChildren> = async ({ children }) => {
  return <>{children}</>;
};

export default RootWrapper;

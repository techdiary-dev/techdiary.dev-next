import React, { PropsWithChildren, Suspense } from "react";

const OAuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <Suspense>{children}</Suspense>;
};

export default OAuthLayout;

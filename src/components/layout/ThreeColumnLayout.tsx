import React, { PropsWithChildren } from "react";
import BaseLayout from "./BaseLayout";

interface Props {
  LeftSidebar?: React.ReactNode;
  RightSidebar?: React.ReactNode;
}
const ThreeColumnLayout: React.FC<PropsWithChildren<Props>> = ({
  children,
  LeftSidebar,
  RightSidebar,
}) => {
  return (
    <BaseLayout>
      <div className="layout wrapper">
        {LeftSidebar && (
          <aside className="layout__aside layout__aside--left">
            <div className="layout__aside__inner">{LeftSidebar}</div>
          </aside>
        )}

        <div className="layout__main app-border-color">{children}</div>

        {RightSidebar && (
          <div className="layout__aside layout__aside--right overflow-y-auto">
            <div className="layout__aside__inner">{RightSidebar}</div>
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

export default ThreeColumnLayout;

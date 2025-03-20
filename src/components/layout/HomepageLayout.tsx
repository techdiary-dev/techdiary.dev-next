import React, { PropsWithChildren } from "react";
import BaseLayout from "./BaseLayout";

interface Props {
  LeftSidebar?: React.ReactNode;
  RightSidebar?: React.ReactNode;
}
const HomepageLayout: React.FC<PropsWithChildren<Props>> = ({
  children,
  LeftSidebar,
  RightSidebar,
}) => {
  return (
    <BaseLayout>
      <div className="grid h-[calc(100vh-3.5rem)] grid-cols-12 overflow-hidden wrapper">
        {LeftSidebar && (
          <aside className="col-span-3 hidden max-h-screen overflow-y-hidden px-6 pt-6 md:block lg:col-span-2">
            <div className="h-full overflow-y-auto">{LeftSidebar}</div>
          </aside>
        )}

        <div className="col-span-12 overflow-y-auto px-3 pt-3 md:col-span-9 md:border-l md:pt-6 lg:col-span-6 lg:border-r app-border-color">
          {children}
        </div>

        {RightSidebar && (
          <div className="col-span-3 hidden max-h-screen overflow-y-hidden px-6 pt-6 lg:block lg:col-span-3">
            <div className="h-full overflow-y-auto">{RightSidebar}</div>
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

export default HomepageLayout;

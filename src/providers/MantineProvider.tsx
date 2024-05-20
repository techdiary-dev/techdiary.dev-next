import { MantineProvider } from "@mantine/core";
import React, { PropsWithChildren } from "react";
import { ModalsProvider } from "@mantine/modals";

const AppMantineProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <MantineProvider
      withCssVariables
      withGlobalClasses
      classNamesPrefix="techdiary-dev"
      defaultColorScheme="dark"
      theme={{
        colors: {
          primary: [
            "color-mix(in srgb, var(--primary), #fff 70%)", // 0
            "color-mix(in srgb, var(--primary), #fff 60%)", // 1
            "color-mix(in srgb, var(--primary), #fff 50%)", // 2
            "color-mix(in srgb, var(--primary), #fff 40%)", // 3
            "color-mix(in srgb, var(--primary), #fff 30%)", // 4
            "color-mix(in srgb, var(--primary), #fff 20%)", // 5
            "color-mix(in srgb, var(--primary), #fff 10%)", // 6
            "var(--primary)", // 7 Base color
            "color-mix(in srgb, var(--primary), #000 15%)", // 8
            "color-mix(in srgb, var(--primary), #000 35%)", // 9
          ],
        },
        primaryColor: "primary",
      }}
    >
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
};

export default AppMantineProvider;

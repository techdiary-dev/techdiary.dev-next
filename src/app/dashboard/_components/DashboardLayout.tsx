"use client";

import Navbar from "@/components/navbar/Navbar";
import { AppShell, Burger, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { PropsWithChildren } from "react";
import DashboardNavbar from "./DashboardNavbar";

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close}>
        <DashboardNavbar />
      </Drawer>

      <AppShell
        header={{ height: 49 }}
        navbar={{ width: 250, breakpoint: "xs", collapsed: { mobile: true } }}
        padding="md"
        withBorder={true}
        styles={{
          navbar: {
            backgroundColor: "var(--muted)",
          },
        }}
      >
        <AppShell.Header>
          <Navbar
            Trailing={
              <Burger
                size={"md"}
                opened={opened}
                onClick={toggle}
                className="sm:hidden"
              />
            }
          />
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <DashboardNavbar />
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </>
  );
};

export default DashboardLayout;

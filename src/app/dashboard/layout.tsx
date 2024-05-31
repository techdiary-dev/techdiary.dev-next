"use client";

import Navbar from "@/components/navbar/Navbar";
import NavbarAction from "@/components/navbar/NavbarAction";
import { AppShell, Burger, Drawer, Group, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { PropsWithChildren } from "react";
import DashboardNavbar from "./_components/DashboardNavbar";

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [opened, { toggle, close }] = useDisclosure(true);

  return (
    <>
      <Drawer opened={opened} onClose={close}>
        <DashboardNavbar />
      </Drawer>

      <AppShell
        header={{ height: 49 }}
        navbar={{ width: 250, breakpoint: "xs", collapsed: { mobile: true } }}
        padding="md"
      >
        <AppShell.Header>
          <Navbar />
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <DashboardNavbar />
        </AppShell.Navbar>
        <AppShell.Main>
          <button onClick={() => toggle()}>clck</button>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default DashboardLayout;

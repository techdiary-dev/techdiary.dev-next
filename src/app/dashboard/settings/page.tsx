"use client";

import { useTranslation } from "@/i18n/use-translation";
import { Tabs } from "@mantine/core";
import SettingGeneralTab from "./_components/SettingGeneralTab";
import SettingProfileTab from "./_components/SettingProfileTab";
import SettingSocialTab from "./_components/SettingSocialTab";

const SettingPage = () => {
  const { _t } = useTranslation();

  return (
    <Tabs defaultValue="general">
      <Tabs.List>
        <Tabs.Tab value="general">{_t("General")}</Tabs.Tab>
        <Tabs.Tab value="social">{_t("Social")}</Tabs.Tab>
        <Tabs.Tab value="profile">{_t("Profile")}</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="general" className="py-2">
        <SettingGeneralTab />
      </Tabs.Panel>
      <Tabs.Panel value="social" className="py-2">
        <SettingSocialTab />
      </Tabs.Panel>
      <Tabs.Panel value="profile" className="py-2">
        <SettingProfileTab />
      </Tabs.Panel>
    </Tabs>
  );
};

export default SettingPage;

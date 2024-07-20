"use client";

import { useTranslation } from "@/i18n/use-translation";
import { Tabs } from "@mantine/core";
import SettingGeneralTab from "./_components/SettingGeneralTab";
import SettingProfileTab from "./_components/SettingProfileReadmeTab";
import SettingSocialTab from "./_components/SettingSocialTab";
import SettingProfileReadmeTab from "./_components/SettingProfileReadmeTab";

const SettingPage = () => {
  const { _t } = useTranslation();

  return (
    <Tabs defaultValue="general">
      <Tabs.List>
        <Tabs.Tab value="general">{_t("General")}</Tabs.Tab>
        <Tabs.Tab value="social">{_t("Social")}</Tabs.Tab>
        <Tabs.Tab value="profile-readme">{_t("Profile Readme")}</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="general" className="py-2">
        <SettingGeneralTab />
      </Tabs.Panel>
      <Tabs.Panel value="social" className="py-2">
        <SettingSocialTab />
      </Tabs.Panel>
      <Tabs.Panel value="profile-readme" className="py-2">
        <SettingProfileReadmeTab />
      </Tabs.Panel>
    </Tabs>
  );
};

export default SettingPage;

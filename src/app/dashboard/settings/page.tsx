import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import _t from "@/i18n/_t";

const SettingsPage = () => {
  return (
    <div>
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="general">{_t("General")}</TabsTrigger>
          <TabsTrigger value="social">{_t("Social")}</TabsTrigger>
          <TabsTrigger value="profile_readme">
            {_t("Profile Readme")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general">Change your password here.</TabsContent>
        <TabsContent value="social">Change your password here.</TabsContent>
        <TabsContent value="profile_readme">
          Change your profile readme here.
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

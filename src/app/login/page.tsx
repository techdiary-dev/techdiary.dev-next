import BaseLayout from "@/components/layout/BaseLayout";
import SocialLoginCard from "@/components/SocialLoginCard";
import SocialLinksWidget from "@/components/widgets/SocialLinksWidget";
import _t from "@/i18n/_t";
import React from "react";

const page = async () => {
  return (
    <BaseLayout>
      <div className="max-w-xl mx-auto my-10 px-4">
        <div className="flex flex-col items-center gap-4 my-4">
          <h3 className="text-xl font-semibold">
            {_t("Join Techdiary community")}
          </h3>
          <p className="text-muted-foreground text-center">
            {_t(
              "A community of 5000+ incredible developers is called Techdiary Community"
            )}
          </p>
        </div>
        <SocialLoginCard />
      </div>
    </BaseLayout>
  );
};

export default page;

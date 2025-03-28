"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/i18n/use-translation";
import React from "react";

const MatrixReport = () => {
  const { _t } = useTranslation();
  return (
    <div className="my-6">
      <h3>{_t("Stats")}</h3>

      <div className="mt-4 grid grid-col-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded">
          <CardContent className="flex flex-col gap-2">
            <p className="text-3xl font-semibold">322</p>
            <div className="text-md text-muted-foreground font-semibold">
              {_t("Total articles")}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded">
          <CardContent className="flex flex-col gap-2">
            <p className="text-3xl font-semibold">522</p>
            <div className="text-md text-muted-foreground font-semibold">
              {_t("Total post reactions")}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded">
          <CardContent className="flex flex-col gap-2">
            <p className="text-3xl font-semibold">1334</p>
            <div className="text-md text-muted-foreground font-semibold">
              {_t("Total post comments")}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MatrixReport;

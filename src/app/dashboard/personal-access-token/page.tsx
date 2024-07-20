"use client";
import { PersonalAccessTokenApiRepository } from "@/http/repositories/personal-access-token.repository";
import { useTranslation } from "@/i18n/use-translation";
import { relativeTime } from "@/utils/relativeTime";
import { Paper, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const PersonalAccessTokenPage = () => {
  const { _t } = useTranslation();
  const api = new PersonalAccessTokenApiRepository();
  const { data } = useQuery({
    queryKey: ["personal-access-token"],
    queryFn: async () => {
      const { data } = await api.getMyTokens();
      return data;
    },
  });
  return (
    <div>
      <Text fz={"xl"} mb={"lg"}>
        {_t("Personal access token")}
      </Text>
      <div className="flex flex-col gap-2">
        {data?.map((token) => (
          <Paper key={token.id} withBorder p={"md"}>
            <Text>{token.name}</Text>
            <Text size="sm">
              <b>{_t("Created At")}</b>:{" "}
              {relativeTime(new Date(token.created_at!))}
            </Text>

            {token.last_used_at && (
              <Text size="sm">
                <b>{_t("Last used at")}</b>:{" "}
                {relativeTime(new Date(token.last_used_at!))}
              </Text>
            )}
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default PersonalAccessTokenPage;

"use client";
import { PersonalAccessTokenApiRepository } from "@/http/repositories/personal-access-token.repository";
import { useTranslation } from "@/i18n/use-translation";
import { relativeTime } from "@/utils/relativeTime";
import { Button, Modal, Paper, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import PersonalAccessTokenForm from "./_components/PersonalAccessTokenForm";
import { useDisclosure } from "@mantine/hooks";

const PersonalAccessTokenPage = () => {
  const [formModalOpened, formModalHandler] = useDisclosure(false);

  const { _t } = useTranslation();
  const api = new PersonalAccessTokenApiRepository();
  const tokenListQuery = useQuery({
    queryKey: ["personal-access-token"],
    queryFn: async () => {
      const { data } = await api.getMyTokens();
      return data;
    },
  });
  const deleteTokenMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      const { data } = await api.deleteToken(tokenId);
      return data;
    },
    onSuccess() {
      tokenListQuery.refetch();
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <div>
          <Text fz={"xl"}>{_t("Personal access token")}</Text>
          <a
            href="https://go.techdiary.dev/api-doc"
            target="_blank"
            className="flex items-center space-x-1 capitalize text-dark"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
            <span>Api Documentation</span>
          </a>
        </div>
        <Button onClick={formModalHandler.toggle}>{_t("New token")}</Button>
      </div>

      {tokenListQuery.isFetched && tokenListQuery.data?.length == 0 && (
        <div className="p-4 mt-6 border-2 border-dashed app-border-color">
          <Image
            className="mx-auto lg:w-4/12"
            src="/images/fabulous-late-night-working.png"
            width={1200}
            height={1200}
            alt={""}
          />

          <h3 className="my-6 text-xl font-semibold text-center text-dark-secondary">
            {_t("You didn't create any personal access token yet")}
          </h3>

          <div className="flex justify-center space-x-4">
            <a
              href="https://go.techdiary.dev/api-doc"
              target="_blank"
              className="flex items-center space-x-1 capitalize text-dark"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              <span>Api Documentation</span>
            </a>
            <button
              onClick={formModalHandler.toggle}
              className="flex items-center px-2 py-1 space-x-1 text-white rounded bg-slate-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{_t("New token")}</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {tokenListQuery.data?.map((token) => (
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

            <button
              onClick={() => {
                openConfirmModal({
                  title: _t("Sure to delete?"),
                  children: _t("No worries, This can be undone anytime."),
                  labels: {
                    confirm: _t("Yes"),
                    cancel: _t("Cancel"),
                  },
                  onConfirm() {
                    deleteTokenMutation.mutate(token.id!);
                  },
                });
              }}
              className="text-destructive hover:underline decoration-2"
            >
              {_t("Delete")}
            </button>
          </Paper>
        ))}
      </div>

      <Modal
        opened={formModalOpened}
        onClose={formModalHandler.toggle}
        size={"lg"}
      >
        <PersonalAccessTokenForm
          onSave={function (): void {
            tokenListQuery.refetch();
          }}
        />
      </Modal>
    </div>
  );
};

export default PersonalAccessTokenPage;

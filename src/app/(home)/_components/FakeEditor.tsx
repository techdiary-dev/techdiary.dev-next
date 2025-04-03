"use client";

import { useAppAlert } from "@/components/app-alert";
import { useTranslation } from "@/i18n/use-translation";
import { useSession } from "@/store/session.atom";
import { useRouter } from "next/navigation";
import React from "react";

const FakeEditor = () => {
  const { _t } = useTranslation();
  const appAlert = useAppAlert();
  const router = useRouter();
  const session = useSession();
  return (
    <button
      className="fake-editor w-full"
      onClick={() => {
        if (session?.session) {
          router.push("/dashboard/articles/new");
        } else {
          appAlert.show({
            title: _t("You are not logged in"),
            description: _t("To do this, you must be logged in"),
            type: "error",
          });
        }
      }}
    >
      <svg viewBox="0 0 512 512" className="fake-editor__icon">
        <path d="M384 250v12c0 6.6-5.4 12-12 12h-98v98c0 6.6-5.4 12-12 12h-12c-6.6 0-12-5.4-12-12v-98h-98c-6.6 0-12-5.4-12-12v-12c0-6.6 5.4-12 12-12h98v-98c0-6.6 5.4-12 12-12h12c6.6 0 12 5.4 12 12v98h98c6.6 0 12 5.4 12 12zm120 6c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-32 0c0-119.9-97.3-216-216-216-119.9 0-216 97.3-216 216 0 119.9 97.3 216 216 216 119.9 0 216-97.3 216-216z"></path>
      </svg>

      <p className="fake-editor__placeholder">{_t("Write new diary 😍")}</p>
    </button>
  );
};

export default FakeEditor;

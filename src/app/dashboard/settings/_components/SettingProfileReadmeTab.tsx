import {
  ProfileApiRepository,
  UpdateProfilePayload,
} from "@/http/repositories/profile.repository";
import { useTranslation } from "@/i18n/use-translation";
import AppAxiosException from "@/utils/AppAxiosException";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import * as Yup from "yup";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { userAtom } from "@/store/user.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  RiBold,
  RiHeading,
  RiImageAddFill,
  RiItalic,
  RiLink,
  RiListOrdered,
  RiListUnordered,
} from "react-icons/ri";
import { markdownToHtml } from "@/utils/markdoc-parser";
import {
  boldCommand,
  headingLevel2Command,
  headingLevel3Command,
  imageCommand,
  italicCommand,
  linkCommand,
  orderedListCommand,
  unorderedListCommand,
  useTextAreaMarkdownEditor,
} from "react-mde";
import { Button } from "@mantine/core";

const SettingProfileReadmeTab = () => {
  const authUser = useAtomValue(userAtom);
  const { _t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editorMode, selectEditorMode] = React.useState<"write" | "preview">(
    "write"
  );

  const api = new ProfileApiRepository();
  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => {
      return api.updateProfile(payload);
    },
    onSuccess() {
      showNotification({
        title: "Updated successfully",
        message: "",
      });
    },
    onError(error: AppAxiosException) {
      const msg = error.response?.data?.message || "Failed to update article";
      setErrorMsg(msg);
    },
  });

  const { ref: editorTextareaRef, commandController } =
    useTextAreaMarkdownEditor({
      commandMap: {
        h2: headingLevel2Command,
        h3: headingLevel3Command,
        bold: boldCommand,
        italic: italicCommand,
        image: imageCommand,
        link: linkCommand,
        ul: unorderedListCommand,
        ol: orderedListCommand,
      },
    });

  const { handleSubmit, setValue, watch } = useForm<ISettingsForm>({
    defaultValues: {
      profile_readme: authUser?.profile_readme || "",
    },
    resolver: yupResolver(SettingsFormValidationSchema),
  });

  const handleOnSubmit: SubmitHandler<ISettingsForm> = (payload) => {
    updateProfileMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      {/* Editor Toolbar */}
      <div className="flex flex-col justify-between md:items-center md:flex-row">
        <div className="flex w-full gap-6 p-2 my-2 bg-muted">
          <EditorCommandButton
            onClick={() => commandController.executeCommand("h2")}
            Icon={<RiHeading size={20} />}
          />

          <EditorCommandButton
            onClick={() => commandController.executeCommand("link")}
            Icon={<RiLink size={20} />}
          />

          <EditorCommandButton
            onClick={() => commandController.executeCommand("bold")}
            Icon={<RiBold size={20} />}
          />

          <EditorCommandButton
            onClick={() => commandController.executeCommand("ul")}
            Icon={<RiListUnordered size={20} />}
          />

          <EditorCommandButton
            onClick={() => commandController.executeCommand("ol")}
            Icon={<RiListOrdered size={20} />}
          />

          <EditorCommandButton
            onClick={() => commandController.executeCommand("italic")}
            Icon={<RiItalic size={20} />}
          />

          <EditorCommandButton
            onClick={() => commandController.executeCommand("image")}
            Icon={<RiImageAddFill size={20} />}
          />
        </div>

        <button
          type="button"
          onClick={() =>
            selectEditorMode(editorMode === "write" ? "preview" : "write")
          }
          className="px-4 font-semibold duration-200 rounded-sm"
        >
          {editorMode === "write" ? _t("Preview") : _t("Editor")}
        </button>
      </div>

      {/* Editor Textarea */}
      <div className="w-full">
        {editorMode === "write" ? (
          <textarea
            tabIndex={2}
            className="focus:outline-none h-[calc(100vh-120px)] bg-background w-full"
            value={watch("profile_readme") || ""}
            placeholder={_t("Write something stunning...")}
            onChange={(e) => {
              setValue("profile_readme", e.target.value);
            }}
            ref={editorTextareaRef}
          ></textarea>
        ) : (
          <div
            className="content-typography"
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(watch("profile_readme") || ""),
            }}
          ></div>
        )}
      </div>
      <div>
        <Button type="submit" loading={updateProfileMutation.isPending}>
          {_t("Save")}
        </Button>
      </div>
    </form>
  );
};

export default SettingProfileReadmeTab;

const SettingsFormValidationSchema = Yup.object().shape({
  profile_readme: Yup.string().optional().label("Name"),
});

type ISettingsForm = Yup.InferType<typeof SettingsFormValidationSchema>;

interface Prop extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  Icon: React.ReactNode;
  isDisabled?: boolean;
}
const EditorCommandButton: React.FC<Prop> = ({ isDisabled, ...props }) => {
  return (
    <button {...props} disabled={isDisabled} type="button">
      {props.Icon}
    </button>
  );
};

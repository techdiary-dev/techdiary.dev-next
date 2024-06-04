"use client";

import { useTranslation } from "@/i18n/use-translation";
import React from "react";
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
import EditorCommandButton from "./EditorCommandButton";
import {
  RiBold,
  RiHeading,
  RiImageAddFill,
  RiItalic,
  RiLink,
  RiListOrdered,
  RiListUnordered,
} from "react-icons/ri";
import {
  Button,
  Drawer,
  Input,
  MultiSelect,
  SegmentedControl,
  Space,
  Switch,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { GearIcon } from "@radix-ui/react-icons";

interface Prop {
  uuid: string;
  onSaved: (content: string) => void;
}

const Editor = () => {
  const { _t } = useTranslation();
  const [mode, selectMode] = React.useState<"write" | "preview">("write");
  const [drawerOpened, drawerOpenHandler] = useDisclosure(false);

  const { ref, commandController } = useTextAreaMarkdownEditor({
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

  return (
    <>
      <Drawer
        opened={drawerOpened}
        onClose={() => drawerOpenHandler.close()}
        position="right"
      >
        <div className="flex flex-col gap-2">
          {/* <ThumbnailUploader
            url={watch("thumbnail") || ""}
            onChange={function (url: string) {
              setValueHook("thumbnail", url, { shouldValidate: true });
              console.log({ url });
            }}
          /> */}

          <Input.Wrapper label="Handle">
            <Input />
          </Input.Wrapper>

          <Input.Wrapper label="Excerpt">
            <Textarea />
          </Input.Wrapper>

          <MultiSelect
            data={[]}
            label="Categories"
            placeholder="Select categories"
          />

          <Switch label="Published" />
        </div>
      </Drawer>

      <div>
        <input
          placeholder={_t("Title")}
          className=" w-full text-2xl focus:outline-none"
        />

        <div className=" flex items-center justify-between flex-col md:flex-row">
          <div className="my-2 flex gap-6">
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

          <div className="flex items-center gap-2">
            <p className="text-sm text-forground-muted">(Saved 3 mins ago)</p>
            <button type="button" onClick={() => drawerOpenHandler.toggle()}>
              <GearIcon className="w-5 h-5" />
            </button>
            <SegmentedControl
              className="my-2"
              onChange={(value) => {
                console.log(value);
              }}
              data={[
                { label: _t("Write"), value: "write" },
                { label: _t("Preview"), value: "preview" },
              ]}
            />
          </div>
        </div>
        <textarea
          className="h-[calc(100vh-120px)] w-full border p-3 focus:outline-none"
          ref={ref}
        ></textarea>
      </div>
    </>
  );
};

export default Editor;

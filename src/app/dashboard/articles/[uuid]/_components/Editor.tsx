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
  Modal,
  MultiSelect,
  SegmentedControl,
  Space,
  Switch,
  Text,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { GearIcon, PlusIcon } from "@radix-ui/react-icons";
import UnsplashImageGallery from "@/components/UnsplashImageGallery";
import { IAppImage } from "@/http/models/AppImage.model";

interface Prop {
  uuid: string;
  onSaved: (content: string) => void;
}

const Editor = () => {
  const { _t } = useTranslation();
  const [mode, selectMode] = React.useState<"write" | "preview">("write");
  const [thumbnail, setThumbnail] = React.useState<IAppImage | null>(null);
  const [drawerOpened, drawerOpenHandler] = useDisclosure(false);
  const [unsplashPickerOpened, unsplashPickerOpenHandler] =
    useDisclosure(false);

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
      <Modal
        opened={unsplashPickerOpened}
        onClose={unsplashPickerOpenHandler.close}
        size={"100vw"}
      >
        <UnsplashImageGallery
          onUploadImage={(image) => {
            setThumbnail(image);
            unsplashPickerOpenHandler.close();
          }}
        />
      </Modal>

      <div className="flex gap-2 justify-between items-center mb-10">
        <div className="text-forground-muted text-sm">(Saved 3 mins ago)</div>
        <div className="flex gap-4">
          <button>Preview</button>
          <button className="text-green-500 bg-muted px-4 py-1">Publish</button>
          <button onClick={() => drawerOpenHandler.toggle()}>
            <GearIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-[750px] mx-auto">
        <input
          placeholder={_t("Title")}
          className=" w-full text-2xl focus:outline-none"
        />

        {/* Thumbnail Section */}
        <div>
          {thumbnail ? (
            <div>{thumbnail?.key}</div>
          ) : (
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 my-4 text-forground-muted">
                <PlusIcon className="w-3 h-3" />
                <Text size="sm">Upload article cover</Text>
              </button>

              <button
                className="flex items-center gap-2 my-4 text-forground-muted"
                onClick={unsplashPickerOpenHandler.open}
              >
                <PlusIcon className="w-3 h-3" />
                <Text size="sm">Pick cover from unsplash</Text>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between flex-col md:flex-row">
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

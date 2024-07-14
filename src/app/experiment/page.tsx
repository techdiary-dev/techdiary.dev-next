"use client";

import UnsplashImageGallery from "@/components/UnsplashImageGallery";
import BaseLayout from "@/components/layout/BaseLayout";
import { IServerFile } from "@/http/models/AppImage.model";
import { Button, Input, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const ExperimentPage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <BaseLayout>
      <Modal opened={opened} onClose={close} size={"100vw"}>
        <UnsplashImageGallery
          onUploadImage={(image: IServerFile) => {
            alert(JSON.stringify(image));
          }}
        />
      </Modal>
      <Button onClick={open}>Open modal</Button>
    </BaseLayout>
  );
};

export default ExperimentPage;

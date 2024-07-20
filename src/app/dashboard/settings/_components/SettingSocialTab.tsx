import { Input } from "@mantine/core";
import { Link1Icon } from "@radix-ui/react-icons";
import React from "react";
import * as yup from "yup";

const SettingSocialTab = () => {
  return (
    <form action="" className="flex flex-col gap-3">
      {Object.keys(formSchema.fields).map((key) => (
        <Input.Wrapper key={key} label={key} className="capitalize">
          <Input placeholder={`Your ${key} link`} leftSection={<Link1Icon />} />
        </Input.Wrapper>
      ))}
    </form>
  );
};

export default SettingSocialTab;

const formSchema = yup.object().shape({
  github: yup.string().url(),
  facebook: yup.string().url(),
  stackOverflow: yup.string().url(),
  medium: yup.string().url(),
  linkedin: yup.string().url(),
  twitter: yup.string().url(),
  instagram: yup.string().url(),
  behance: yup.string().url(),
  dribbble: yup.string().url(),
  twitch: yup.string().url(),
  youtube: yup.string().url(),
});
type ISettingsForm = yup.InferType<typeof formSchema>;

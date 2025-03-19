import {
  ProfileApiRepository,
  UpdateProfilePayload,
} from "@/http/repositories/profile.repository";
import { useTranslation } from "@/i18n/use-translation";
import { userAtom } from "@/store/user.atom";
import AppAxiosException from "@/utils/AppAxiosException";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Link1Icon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

const SettingSocialTab = () => {
  const authUser = useAtomValue(userAtom);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { _t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISettingsForm>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      github: authUser?.social_links?.github || "",
      facebook: authUser?.social_links?.facebook || "",
      stackOverflow: authUser?.social_links?.stackOverflow || "",
      medium: authUser?.social_links?.medium || "",
      linkedin: authUser?.social_links?.linkedin || "",
      twitter: authUser?.social_links?.twitter || "",
      instagram: authUser?.social_links?.instagram || "",
      behance: authUser?.social_links?.behance || "",
      dribbble: authUser?.social_links?.dribbble || "",
      twitch: authUser?.social_links?.twitch || "",
      youtube: authUser?.social_links?.youtube || "",
    },
  });

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

  const handleOnSubmit: SubmitHandler<ISettingsForm> = (payload) => {
    updateProfileMutation.mutate({ social_links: payload as any });
  };

  return (
    <form
      onSubmit={handleSubmit(handleOnSubmit)}
      className="flex flex-col gap-3"
    >
      {Object.keys(formSchema.fields).map((key: any) => (
        <Input.Wrapper
          key={key}
          label={key}
          className="capitalize"
          error={<ErrorMessage name={key} errors={errors} />}
        >
          <Input
            placeholder={`Your ${key} link`}
            leftSection={<Link1Icon />}
            {...register(key as any)}
          />
        </Input.Wrapper>
      ))}

      <div>
        <Button loading={updateProfileMutation.isPending} type="submit">
          {_t("Save")}
        </Button>
      </div>
    </form>
  );
};

export default SettingSocialTab;

const formSchema = yup.object().shape({
  github: yup.string().optional().nullable().url(),
  facebook: yup.string().optional().nullable().url(),
  stackOverflow: yup.string().optional().nullable().url(),
  medium: yup.string().optional().nullable().url(),
  linkedin: yup.string().optional().nullable().url(),
  twitter: yup.string().optional().nullable().url(),
  instagram: yup.string().optional().nullable().url(),
  behance: yup.string().optional().nullable().url(),
  dribbble: yup.string().optional().nullable().url(),
  twitch: yup.string().optional().nullable().url(),
  youtube: yup.string().optional().nullable().url(),
});
type ISettingsForm = yup.InferType<typeof formSchema>;

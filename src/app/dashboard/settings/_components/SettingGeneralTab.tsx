import {
  ProfileApiRepository,
  UpdateProfilePayload,
} from "@/http/repositories/profile.repository";
import { useTranslation } from "@/i18n/use-translation";
import { userAtom } from "@/store/user.atom";
import AppAxiosException from "@/utils/AppAxiosException";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, Input, Textarea } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";

const SettingGeneralTab = () => {
  const authUser = useAtomValue(userAtom);
  const { _t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ISettingsForm>({
    defaultValues: {
      name: authUser?.name || "",
      email: authUser?.email || "",
      username: authUser?.username || "",
      education: authUser?.education || "",
      designation: authUser?.designation || "",
      website_url: authUser?.website_url || "",
      location: authUser?.location || "",
      bio: authUser?.bio || "",
    },
    resolver: yupResolver(SettingsFormValidationSchema),
  });

  const handleOnChangeUsernameDebounce = useDebouncedCallback(
    async (username: string) => {
      await api
        .getUniqueUsername(username)
        .then((res) => {
          if (res?.data?.username) {
            setValue("username", res?.data?.username);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    2000
  );

  const handleOnSubmit: SubmitHandler<ISettingsForm> = (data) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleOnSubmit)}
      className="flex flex-col gap-3"
    >
      {errorMsg && (
        <Alert variant="filled" color="red">
          {errorMsg}
        </Alert>
      )}
      <Input.Wrapper
        label={_t("Name")}
        error={<ErrorMessage name={"name"} errors={errors} />}
      >
        <Input placeholder={_t("Your name")} {...register("name")} />
      </Input.Wrapper>

      <Input.Wrapper
        label={_t("Username")}
        error={<ErrorMessage name={"username"} errors={errors} />}
      >
        <Input
          placeholder={_t("Your username")}
          value={watch("username") || ""}
          onChange={(e) => {
            setValue("username", e.target.value);
            handleOnChangeUsernameDebounce(e.target.value);
          }}
        />
      </Input.Wrapper>

      <Input.Wrapper
        label={_t("Email")}
        error={<ErrorMessage name={"email"} errors={errors} />}
      >
        <Input placeholder={_t("Your email")} {...register("email")} />
      </Input.Wrapper>

      <Input.Wrapper
        label={_t("Educational qualification")}
        error={<ErrorMessage name={"education"} errors={errors} />}
      >
        <Input
          placeholder={_t("Your education qualification")}
          {...register("education")}
        />
      </Input.Wrapper>

      <Input.Wrapper
        label={_t("Designation or mental title")}
        error={<ErrorMessage name={"designation"} errors={errors} />}
      >
        <Input
          placeholder={_t("Your designation or mental title")}
          {...register("designation")}
        />
      </Input.Wrapper>

      <Input.Wrapper
        label={_t("Website url")}
        error={<ErrorMessage name={"website_url"} errors={errors} />}
      >
        <Input
          placeholder={_t("Your website url")}
          {...register("website_url")}
        />
      </Input.Wrapper>

      <Input.Wrapper
        label={_t("Location")}
        error={<ErrorMessage name={"location"} errors={errors} />}
      >
        <Input placeholder={_t("Your location")} {...register("location")} />
      </Input.Wrapper>

      <Input.Wrapper
        label={_t("Bio")}
        error={<ErrorMessage name={"bio"} errors={errors} />}
      >
        <Textarea placeholder={_t("Your short bio")} {...register("bio")} />
      </Input.Wrapper>

      <div>
        <Button type="submit" loading={updateProfileMutation.isPending}>
          {_t("Save")}
        </Button>
      </div>
    </form>
  );
};

export default SettingGeneralTab;

const SettingsFormValidationSchema = Yup.object().shape({
  name: Yup.string()
    .optional()
    .max(50, "Name cannot exceed 255 characters")
    .label("Name"),

  username: Yup.string()
    .optional()
    .max(50, "Username cannot exceed 255 characters")
    .label("Username"),

  email: Yup.string()
    .email()
    .optional()
    .max(50, "Email cannot exceed 255 characters")
    .label("Email"),

  education: Yup.string()
    .optional()
    .max(50, "Education cannot exceed 255 characters")
    .label("Education"),

  designation: Yup.string()
    .optional()
    .max(255, "Designation cannot exceed 255 characters")
    .label("Designation"),

  website_url: Yup.string()
    .optional()
    .max(255, "Website url cannot exceed 255 characters")
    .url()
    .label("Website url"),

  location: Yup.string()
    .optional()
    .max(255, "Location cannot exceed 255 characters")
    .label("Location"),

  bio: Yup.string()
    .optional()
    .max(255, "Bio cannot exceed 255 characters")
    .label("Bio"),
});

type ISettingsForm = Yup.InferType<typeof SettingsFormValidationSchema>;

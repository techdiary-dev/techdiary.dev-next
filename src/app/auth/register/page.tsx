"use client";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import BaseLayout from "@/components/layout/BaseLayout";
import { Alert, Button, Input, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { AuthRepository } from "@/http/repositories/auth.repository";
import { useMutation } from "@tanstack/react-query";
import { ensureCSRF } from "@/utils/ensureCSRF";
import { showNotification } from "@mantine/notifications";
import { AxiosError } from "axios";

import {
  getHookFormErrorMessage,
  getServerErrorMessage,
} from "@/utils/form-error";
import { useTranslation } from "@/i18n/use-translation";
import { useDebouncedCallback } from "@mantine/hooks";
import { ProfileApiRepository } from "@/http/repositories/profile.repository";

const RegisterPage = () => {
  const { _t } = useTranslation();
  const api = new AuthRepository();
  const api__profile = new ProfileApiRepository();
  const registrationMutation = useMutation({
    mutationFn: (payload: IRegistrationFormPayload) => api.register(payload),
  });

  const form = useForm<IRegistrationFormPayload>({
    resolver: yupResolver(formValidationSchema),
  });

  const handleOnChangeUsernameDebounce = useDebouncedCallback(
    (username: string) => {
      ensureCSRF(async () => {
        await api__profile.getPublicUniqueUsername(username).then((res) => {
          if (res?.data?.username) {
            form.setValue("username", res?.data?.username);
          }
        });
      });
    },
    500
  );

  const onSubmit = async (data: IRegistrationFormPayload) => {
    await ensureCSRF(() => {
      registrationMutation.mutate(data, {
        onSuccess: () => {
          window.location.href = "/";
        },
      });
    });
  };

  return (
    <BaseLayout>
      <div className="max-w-96 mx-auto my-10 px-2">
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
          method="post"
        >
          {registrationMutation.isError && (
            <Alert color="red" title="কিছু ভুল হয়েছে">
              {getServerErrorMessage(registrationMutation.error)}
            </Alert>
          )}

          <Input.Wrapper
            label={_t("Name")}
            error={getHookFormErrorMessage("name", form?.formState?.errors)}
          >
            <Input
              placeholder={_t("Your name")}
              size="lg"
              variant="filled"
              {...form.register("name")}
            />
          </Input.Wrapper>

          <Input.Wrapper
            label={_t("Username")}
            error={getHookFormErrorMessage("username", form?.formState?.errors)}
          >
            <Input
              placeholder={_t("Your username")}
              size="lg"
              variant="filled"
              value={form.watch("username") || ""}
              onChange={(e) => {
                form.setValue("username", e.target.value);
                handleOnChangeUsernameDebounce(e.target.value);
              }}
            />
          </Input.Wrapper>

          <Input.Wrapper
            label={_t("Email")}
            error={getHookFormErrorMessage("email", form?.formState?.errors)}
          >
            <Input
              placeholder={_t("Your email")}
              size="lg"
              variant="filled"
              {...form.register("email")}
            />
          </Input.Wrapper>

          <Input.Wrapper
            label={_t("Password")}
            error={getHookFormErrorMessage("password", form?.formState?.errors)}
          >
            <Input
              placeholder="***********"
              type="password"
              size="lg"
              variant="filled"
              {...form.register("password")}
            />
          </Input.Wrapper>

          <Input.Wrapper
            label={_t("Confirm password")}
            error={getHookFormErrorMessage(
              "password_confirmation",
              form?.formState?.errors
            )}
          >
            <Input
              placeholder="***********"
              type="password"
              size="lg"
              variant="filled"
              {...form.register("password_confirmation")}
            />
          </Input.Wrapper>
          <Button
            type="submit"
            size="lg"
            loading={registrationMutation?.isPending}
          >
            {_t("Register")}
          </Button>
        </form>

        <div className="mt-10 flex gap-3">
          {_t("Already have an account?")}{" "}
          <Link className="text-lg" href={"/auth/login"}>
            {_t("Login")}
          </Link>
        </div>
      </div>
    </BaseLayout>
  );
};

const formValidationSchema = yup.object({
  name: yup.string().required().label("Name"),
  username: yup.string().required().label("Username"),
  email: yup.string().email().required().label("Email"),
  password: yup.string().min(6).max(32).required().label("Password"),
  password_confirmation: yup
    .string()
    .min(6)
    .max(32)
    .required()
    .label("Password"),
});

type IRegistrationFormPayload = yup.InferType<typeof formValidationSchema>;

export default RegisterPage;

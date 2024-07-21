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

const LoginPage = () => {
  const { _t } = useTranslation();
  const api = new AuthRepository();
  const loginMutation = useMutation({
    mutationFn: (payload: ILoginFormPayload) => api.login(payload),
  });

  const form = useForm<ILoginFormPayload>({
    resolver: yupResolver(formValidationSchema),
  });

  const onSubmit = async (data: ILoginFormPayload) => {
    await ensureCSRF(() => {
      loginMutation.mutate(data, {
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
          {loginMutation.isError && (
            <Alert color="red" title={_t("Hands Up")}>
              {getServerErrorMessage(loginMutation.error)}
            </Alert>
          )}

          <Input.Wrapper
            error={getHookFormErrorMessage("email", form?.formState?.errors)}
          >
            <Input
              placeholder={_t("Email")}
              type="email"
              size="lg"
              variant="filled"
              {...form.register("email")}
            />
          </Input.Wrapper>

          <Input.Wrapper
            error={getHookFormErrorMessage("password", form?.formState?.errors)}
          >
            <Input
              placeholder={_t("Password")}
              type="password"
              size="lg"
              variant="filled"
              {...form.register("password")}
            />
          </Input.Wrapper>

          <Button type="submit" size="lg" loading={loginMutation?.isPending}>
            {_t("Login")}
          </Button>
        </form>

        <div className="mt-10 flex flex-col gap-3">
          <Link className="text-lg" href={"/auth/forgot-password"}>
            {_t("Forgot password?")}
          </Link>

          <Link className="text-lg" href={"/auth/register"}>
            {_t("Create an account")}
          </Link>
        </div>
      </div>
    </BaseLayout>
  );
};

const formValidationSchema = yup.object({
  email: yup.string().email().required().label("Email"),
  password: yup.string().min(6).max(32).required().label("Password"),
});

type ILoginFormPayload = yup.InferType<typeof formValidationSchema>;

export default LoginPage;

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
import { useRouter, useSearchParams } from "next/navigation";
import {
  getHookFormErrorMessage,
  getServerErrorMessage,
} from "@/utils/form-error";

const ResetPasswordPage = () => {
  const api = new AuthRepository();
  const searchParams = useSearchParams();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: {
      token: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => api.resetPassword(payload),
  });

  const form = useForm<ILoginFormPayload>({
    resolver: yupResolver(formValidationSchema),
  });

  const onSubmit = async (data: ILoginFormPayload) => {
    await ensureCSRF(() => {
      mutation.mutate(
        {
          email: searchParams.get("email") || "",
          token: searchParams.get("token") || "",
          ...data,
        },
        {
          onSuccess: () => {
            showNotification({
              title: "Password has been reset successfully",
              message: "",
            });
            router.push("/auth/login");
          },
        }
      );
    });
  };

  return (
    <BaseLayout>
      <div className="max-w-96 mx-auto my-10">
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {mutation.isError && (
            <Alert color="red" title="কিছু ভুল হয়েছে">
              {getServerErrorMessage(mutation.error)}
            </Alert>
          )}
          <Input.Wrapper label="Email (Read Only)">
            <Input
              placeholder="Email"
              type="email"
              size="lg"
              variant="filled"
              value={searchParams.get("email") || ""}
              disabled
            />
          </Input.Wrapper>

          <Input.Wrapper
            label="Password"
            error={getHookFormErrorMessage("password", form?.formState?.errors)}
          >
            <Input
              placeholder="Password"
              type="password"
              size="lg"
              variant="filled"
              {...form.register("password")}
            />
          </Input.Wrapper>

          <Input.Wrapper
            label="Password Confirmation"
            error={getHookFormErrorMessage(
              "password_confirmation",
              form?.formState?.errors
            )}
          >
            <Input
              placeholder="Password Confirmation"
              type="password"
              size="lg"
              variant="filled"
              {...form.register("password_confirmation")}
            />
          </Input.Wrapper>

          <Button type="submit" size="lg" loading={mutation?.isPending}>
            Reset Password
          </Button>
        </form>

        <div className="mt-10 flex flex-col gap-3">
          <Link className="text-lg" href={"/auth/forgot-password"}>
            পাসসোয়ার্ড ভুলে গেছেন?
          </Link>

          <Link className="text-lg" href={"/auth/register"}>
            একাউন্ট নিবন্ধন করুন
          </Link>
        </div>
      </div>
    </BaseLayout>
  );
};

const formValidationSchema = yup.object({
  password: yup.string().required().label("Password"),
  password_confirmation: yup.string().required().label("Password Confirmation"),
});

type ILoginFormPayload = yup.InferType<typeof formValidationSchema>;

export default ResetPasswordPage;

"use client";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BaseLayout from "@/components/layout/BaseLayout";
import { Button, Input, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { AuthRepository } from "@/http/repositories/auth.repository";
import { useMutation } from "@tanstack/react-query";
import { ensureCSRF } from "@/utils/ensureCSRF";

const LoginPage = () => {
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
        onError: () => {
          alert("Login failed");
        },
      });
    });
  };

  return (
    <BaseLayout>
      <div className="max-w-96 mx-auto my-10">
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Input.Wrapper>
            <Input
              placeholder="Email"
              type="email"
              required
              size="lg"
              variant="filled"
              {...form.register("email")}
            />
          </Input.Wrapper>
          <Input.Wrapper>
            <Input
              placeholder="Password"
              type="password"
              required
              size="lg"
              variant="filled"
              {...form.register("password")}
            />
          </Input.Wrapper>
          <Button type="submit" size="lg">
            লগইন
          </Button>
        </form>

        <div className="mt-10 flex flex-col gap-3">
          <Link className="text-xl" href={"/auth/forgot-password"}>
            পাসসোয়ার্ড ভুলে গেছেন?
          </Link>

          <Link className="text-xl" href={"/auth/register"}>
            একাউন্ট নিবন্ধন করুন
          </Link>
        </div>
      </div>
    </BaseLayout>
  );
};

const formValidationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(32).required(),
});

type ILoginFormPayload = yup.InferType<typeof formValidationSchema>;

export default LoginPage;

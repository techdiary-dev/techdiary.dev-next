"use client";

import { http } from "@/http/http.client";
import BaseLayout from "@/components/layout/BaseLayout";
import { Loader, Space, Text } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const OAuthCallbackClient = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    http.get("sanctum/csrf-cookie").then((res) => {
      http
        .post(`/api/auth/signed-login?${searchParams.toString()}`)
        .then((_res) => {
          http.post("api/auth/login-spark").then((res) => {
            console.log({
              res,
              _res,
            });
            window.location.href = "/";
          });
        });
    });
  }, [searchParams]);

  return (
    <BaseLayout>
      <div className=" grid place-items-center h-[calc(100vh-5rem)]">
        <div className=" text-center">
          <Loader size={"lg"} />
          <Space h={20} />
          <Text className="text-center" size="xl">
            দয়া করে অপেক্ষা করুন। আপনি কিছুক্ষণের মধ্যে লগইন হয়ে যাবেন।
          </Text>
        </div>
      </div>
    </BaseLayout>
  );
};

const OAuthCallback = () => {
  return (
    <Suspense fallback={<h1>Please wait...</h1>}>
      <OAuthCallbackClient />
    </Suspense>
  );
};

export default OAuthCallback;

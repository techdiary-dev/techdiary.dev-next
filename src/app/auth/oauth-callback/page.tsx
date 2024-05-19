"use client";

import { http } from "@/clients/http.client";
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

  return <h1>Please wait... </h1>;
};

const OAuthCallback = () => {
  return (
    <Suspense fallback={<h1>Please wait...</h1>}>
      <OAuthCallbackClient />
    </Suspense>
  );
};

export default OAuthCallback;

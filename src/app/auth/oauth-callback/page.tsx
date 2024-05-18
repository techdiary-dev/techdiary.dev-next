"use client";

import { http } from "@/clients/http.client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const OAuthCallback = () => {
  const searchParams = useSearchParams();

  const router = useRouter();

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
            // router.push("/");
          });
        });
    });
  }, [searchParams]);

  return <h1>Please wait...</h1>;
};

export default OAuthCallback;

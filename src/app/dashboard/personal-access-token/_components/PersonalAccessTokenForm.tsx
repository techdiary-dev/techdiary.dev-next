import { PersonalAccessTokenApiRepository } from "@/http/repositories/personal-access-token.repository";
import { useTranslation } from "@/i18n/use-translation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Divider, Input, Text } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import * as Yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

interface Prop {
  onSave: () => void;
}
const PersonalAccessTokenForm: React.FC<Prop> = ({ onSave }) => {
  const { _t } = useTranslation();
  const [createdToken, setCreatedToken] = useState("");
  const api = new PersonalAccessTokenApiRepository();

  const createTokenMutation = useMutation({
    mutationFn: (payload: { name: string }) => {
      return api.createToken(payload);
    },
    onSuccess(data) {
      setCreatedToken(data.token);
      onSave();
    },
  });

  const form = useForm<IForm>({
    resolver: yupResolver(formValidationSchema),
  });

  const handleOnSubmit: SubmitHandler<IForm> = (payload) => {
    createTokenMutation.mutate(payload);
  };

  return (
    <form onSubmit={form.handleSubmit(handleOnSubmit)}>
      {!createdToken && (
        <>
          <Input.Wrapper
            label={_t("Token name")}
            error={
              <ErrorMessage name={"name"} errors={form.formState.errors} />
            }
          >
            <Input {...form.register("name")} />
          </Input.Wrapper>

          <Button loading={createTokenMutation.isPending} type="submit">
            {_t("Save")}
          </Button>
        </>
      )}

      {createdToken && (
        <>
          <Text>
            {_t("Save this token carefully, We will not show this in future")}
          </Text>
          <Input value={createdToken} readOnly />
        </>
      )}
    </form>
  );
};

export default PersonalAccessTokenForm;

const formValidationSchema = Yup.object().shape({
  name: Yup.string().required().min(5).max(255).label("Name"),
});

type IForm = Yup.InferType<typeof formValidationSchema>;

import { AxiosError } from "axios";
import { FieldErrors } from "react-hook-form";

export const getHookFormErrorMessage = (key: string, errors: FieldErrors) => {
  if (errors[key]?.message) {
    return errors[key]?.message as string;
  }

  return "";
};

export const getServerErrorMessage = (error: Error) => {
  if (error instanceof AxiosError) {
    return error.response?.data.message || "কিছু ভুল হয়েছে";
  }

  return error.message || "কিছু ভুল হয়েছে";
};

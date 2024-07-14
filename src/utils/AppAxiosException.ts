import { AxiosError, AxiosResponse } from "axios";

class AppAxiosException extends AxiosError {
  constructor(error: AxiosError) {
    super(error.message, error.code, error.config);
  }

  response?:
    | AxiosResponse<
        {
          message?: string;
          errors?: string[];
        },
        any
      >
    | undefined;
}

export default AppAxiosException;

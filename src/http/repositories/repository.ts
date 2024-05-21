import { AxiosInstance } from "axios";
import { http } from "../http.client";

export class ApiRepository {
  protected http: AxiosInstance;
  constructor() {
    this.http = http;
  }
}

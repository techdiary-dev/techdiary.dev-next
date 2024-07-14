import { ApiRepository } from "./repository";

export type TCloudinaryPreset =
  | "techdiary-user-profile-photos"
  | "techdiary-article-covers"
  | "techdiary-article-assets";

export interface FileUploadQuery {
  file: File;
  preset?: TCloudinaryPreset;
}

export class FileApiRepository extends ApiRepository {
  public async uploadFile(payload: FileUploadQuery) {
    const formData = new FormData();
    formData.append("file", payload.file);
    if (payload?.preset) {
      formData.append("preset", payload.preset);
    }

    const { data } = await this.http.post<any>("/api/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  }

  public async deleteFile(keys: string[]) {
    const { data } = await this.http.delete(`/api/files`, {
      data: { keys },
    });
    return data;
  }
}

import { IAppImage } from "@/http/models/AppImage.model";
import { useTranslation } from "@/i18n/use-translation";
import {
  Button,
  Image,
  Input,
  LoadingOverlay,
  Skeleton,
  Title,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { UploadIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiUpload } from "react-icons/fi";

interface IProp {
  onUploadImage: (image: IAppImage) => void;
}

const UnsplashImageGallery: React.FC<IProp> = ({ onUploadImage }) => {
  const { _t } = useTranslation();
  const [q, setQ] = useDebouncedState("", 500);
  const { data, isLoading } = useQuery({
    queryKey: ["unsplash", q],
    queryFn: async () => {
      const res = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          client_id: "k0j9Wqxzzexx-YpdFUDb1z8wVYbIy7T_6gjzJi3NpRg",
          query: q || "article",
          per_page: 100,
          // orientation: "landscape",
        },
      });

      return (res?.data?.results as IUnsplashImage[]) || [];
    },
  });

  const mutation = useMutation({
    mutationFn: async (url: string) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/cloudinary/upload-by-url`,
        { url, folder: "landscape" }
      ) as any;
    },
    onSuccess: (data) => {
      onUploadImage({
        key: data?.data?.public_id || "",
        provider: "cloudinary",
      });
    },
    onError: () => {
      showNotification({
        message: _t("Failed to upload image"),
        color: "red",
      });
    },
  });

  return (
    <div className="relative">
      <LoadingOverlay
        visible={mutation.isPending}
        zIndex={1000}
        overlayProps={{
          radius: "sm",
          blur: 25,
        }}
      />
      <div className="flex flex-col gap-3 mb-4">
        <Title order={3}>Unsplash</Title>
        <Input
          placeholder="Search for an image"
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div>
        <div className="columns-1 gap-5 sm:columns-2 sm:gap-8 md:columns-3 lg:columns-4 [&>img:not(:first-child)]:mt-8">
          {data?.map((image) => (
            <div
              key={image.id}
              onClick={() => mutation.mutate(image.urls.regular)}
              className="relative mb-6 rounded-lg overflow-hidden group cursor-pointer"
            >
              <Image src={image.urls.regular} alt={image.description!} />
              <div className="bg-black/45 opacity-0 absolute top-0 right-0 bottom-0 left-0 transition-all duration-300 group-hover:opacity-100 flex items-center justify-center">
                <UploadIcon className="w-10 h-10 z-50" />
              </div>
            </div>
          ))}

          {isLoading &&
            Array(30)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <Skeleton
                    mb={"lg"}
                    height={Math.floor(Math.random() * 200) + 200}
                    radius={"md"}
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default UnsplashImageGallery;

export interface IUnsplashImage {
  id: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
  promoted_at: null;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: null | string;
  alt_description: string;
  urls: UnsplashImageUrls;
  likes: number;
}

interface UnsplashImageUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
  small_s3: string;
}

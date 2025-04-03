import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const NotificationPage = () => {
  return (
    <div className="flex flex-col gap-2">
      <ExclamationTriangleIcon className="size-10 text-yellow-400" />
      <h2 className=" text-2xl">এই ফিচার এখনো শেষ হয়নি</h2>
    </div>
  );
};

export default NotificationPage;

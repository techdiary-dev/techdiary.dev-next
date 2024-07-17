import Image from "next/image";
import React from "react";

const loading = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-120px)] animate-pulse">
      <Image src="/logo-lg.png" alt="logo" width={200} height={200} />
    </div>
  );
};

export default loading;

import {
  getSeriesDetailByHandle,
  seriesFeed,
} from "@/backend/services/series.action";
import React from "react";

const page = async () => {
  const series = await getSeriesDetailByHandle("js");

  return (
    <div>
      <pre>{JSON.stringify(series, null, 2)}</pre>
    </div>
  );
};

export default page;

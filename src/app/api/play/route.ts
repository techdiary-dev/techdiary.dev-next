import * as articleActions from "@/backend/services/article.actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    handle: await articleActions.getUniqueArticleHandle(
      "untitled",
      "fc6cfc91-f017-4923-9706-8813ae8df621"
    ),
  });
}

import {persistenceRepository} from "@/backend/persistence-repositories";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
  // [
  //   {
  //     "key": "article_id",
  //     "operator": "=",
  //     "value": "317eb5cf-9ef5-4ef1-9da7-78007dd83149"
  //   },
  //   {
  //     "key": "tag_id",
  //     "operator": "not in",
  //     "value": []
  //   }
  // ]
  return NextResponse.json({
    handle: await persistenceRepository.articleTag.deleteRows({
      where: {
        AND: [
          {
            "key": "article_id",
            "operator": "=",
            "value": "317eb5cf-9ef5-4ef1-9da7-78007dd83149"
          },
          {
            "key": "tag_id",
            "operator": "not in",
            "value": ["060f882f-e40e-415b-bc06-ed618f77d9bc", "2e27c4b0-226d-41ed-ae3f-3f9ac493b6a7"]
          }
        ]
      }
    }),
  });
}

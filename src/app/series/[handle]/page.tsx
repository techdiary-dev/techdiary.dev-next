import * as seriesActions from "@/backend/services/series.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import getFileUrl from "@/utils/getFileUrl";
import { Book, BookOpen, Calendar, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface SeriesDetailPageProps {
  params: {
    handle: string;
  };
}

async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { handle } = params;
  const seriesData = await seriesActions.getSeriesDetailByHandle(handle);

  if (!seriesData || !seriesData.series) {
    notFound();
  }

  const { series, serieItems } = seriesData;

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          <h1 className="text-3xl font-bold mb-4">{series.title}</h1>

          {series.description && (
            <p className="text-muted-foreground mb-6">{series.description}</p>
          )}

          <div className="flex items-center gap-3 mb-8">
            <Link href={`/@${series.owner?.username}`}>
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={series.owner?.profile_photo}
                  alt={series.owner?.name}
                />
                <AvatarFallback>{series.owner?.name?.[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link
                href={`/@${series.owner?.username}`}
                className="font-medium hover:underline"
              >
                {series.owner?.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                <Calendar className="inline mr-1 h-3 w-3" />
                {new Date(series.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Book className="h-5 w-5" />
              Articles in this series
            </h2>
            {serieItems.length === 0 ? (
              <p className="text-muted-foreground italic">
                This series doesn't have any articles yet.
              </p>
            ) : (
              <div className="space-y-4">
                {serieItems.map((item, index) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        {item.type === "TITLE" ? (
                          <h3 className="font-semibold">{item.title}</h3>
                        ) : (
                          <Link
                            href={`/@${series.owner?.username}/${item.article?.handle}`}
                            className="font-semibold hover:underline flex justify-between items-center"
                          >
                            <span>{item.article?.title}</span>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1">
          <div className="sticky top-6">
            {series.cover_image ? (
              <div className="relative aspect-square h-full mb-6 rounded-lg overflow-hidden">
                <Image
                  src={getFileUrl(series.cover_image)}
                  alt={series.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square bg-primary/10 rounded-lg mb-6 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-primary/50" />
              </div>
            )}

            <div className="bg-card rounded-lg p-4 border border-border">
              <h3 className="font-medium mb-4">About this series</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Articles</span>
                  <span className="font-medium">
                    {
                      serieItems.filter((item) => item.type === "article")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {new Date(series.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="font-medium">
                    {new Date(series.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeriesDetailPage;

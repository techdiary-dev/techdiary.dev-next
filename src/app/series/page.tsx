import { getMySeries } from "@/backend/services/series.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

const SeriesPage = async () => {
  const series = await getMySeries();

  return (
    <div className="container max-w-5xl py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Series</h1>
          <p className="text-muted-foreground mt-1">
            Collections of related articles organized in a sequence
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/series/new">
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Series
          </Link>
        </Button>
      </div>

      {series && series.nodes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {series.nodes.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="truncate">{item.title}</CardTitle>
              </CardHeader>
              {/* <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookIcon className="w-4 h-4" />
                  <span>{item.article_count || 0} articles</span>
                </div>
              </CardContent> */}
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/series/${item.handle}`}>View Series</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/series/${item.id}/edit`}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-muted rounded-lg p-12 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted-foreground/20">
            <BookIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">No series found</h2>
          <p className="mt-2 text-muted-foreground">
            You haven't created any series yet. Series help you organize
            multiple articles in a sequence.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/dashboard/series/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create your first series
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SeriesPage;

import { Metadata } from "next";
import BookmarksPage from "./page.client";

export const metadata: Metadata = {
  title: "Bookmarks",
};

const BookmarkPage = () => {
  return <BookmarksPage />;
};

export default BookmarkPage;

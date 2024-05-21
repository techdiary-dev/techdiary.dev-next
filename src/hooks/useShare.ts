const useShare = (shareableUrl: string) => {
  const share = (provider: "facebook" | "twitter") => {
    switch (provider) {
      case "facebook":
        window.open(
          "https://www.facebook.com/sharer/sharer.php?u=" + shareableUrl,
          "pop",
          "width=600, height=400, scrollbars=no"
        );

        break;
      case "twitter":
        window.open(
          "https://twitter.com/intent/tweet?text=Check%20out%20this%20article%20on%20the%20blog techdiary%20" +
            shareableUrl,
          "pop",
          "width=600, height=400, scrollbars=no"
        );
        break;
    }
  };
  return { share };
};

export default useShare;

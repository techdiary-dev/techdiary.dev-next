import _t from "@/i18n/_t";

const SearchInput = async () => {
  return (
    <div className="relative hidden w-full max-w-xl lg:block">
      <div className="search">
        <input
          type="text"
          placeholder={await _t("Type to search")}
          className="w-full rounded border border-border bg-muted p-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-slate-800"
          v-model="query"
        />
      </div>
    </div>
  );
};

export default SearchInput;

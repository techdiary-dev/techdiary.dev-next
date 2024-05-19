import Link from "next/link";
import React from "react";

const SearchInput = () => {
  return (
    <div className="relative hidden w-full max-w-xl lg:block">
      <div className="search">
        <input
          type="text"
          placeholder="Type to search"
          className="search__input p-2"
          v-model="query"
        />
      </div>
    </div>
  );
};

export default SearchInput;

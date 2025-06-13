import { Icon } from "@iconify/react";

export default function SearchBar() {
  return (
    <div className="relative mt-6">
      <Icon
        icon="mingcute:search-line"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-xl"
      />
      <input
        className="bg-base-primary border border-border w-full pl-11 py-3 px-5 rounded-sm focus:outline-accent focus:outline"
        placeholder="Search..."
      />
    </div>
  );
}

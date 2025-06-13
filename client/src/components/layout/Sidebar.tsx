import Logo from "../generic/Logo";
import SearchBar from "./SearchBar";
import StorageUsage from "./StorageUsage";

export default function Sidebar() {
  return (
    <aside className="flex flex-col bg-base-secondary px-6 py-6">
      <div className="flex gap-4 items-center">
        <Logo />
        <h2 className="text-2xl">Ledgerv.</h2>
      </div>
      <SearchBar />
      <div className="flex-1"></div>
      <StorageUsage />
    </aside>
  );
}

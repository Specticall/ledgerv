import useStorageUsageQuery from "@/hooks/queries/useStorageUsageQuery";
import { Button } from "../ui/Button";
import { Icon } from "@iconify/react";

export default function StorageUsage() {
  const { storageUsageData } = useStorageUsageQuery();

  if (!storageUsageData) {
    return <div>Loading...</div>;
  }

  const usedGB = (storageUsageData?.usedStorageMB || 0) / 1000;
  const maxGB = (storageUsageData?.maxStorageMB || 0) / 1000;
  const percentage = (usedGB / maxGB) * 100;

  return (
    <div className="bg-base-primary border border-border rounded-sm px-4 py-4">
      <div
        className="flex items-center justify-center flex-col aspect-square rounded-full w-full mb-5"
        style={{
          boxShadow: " 0 0 10px 4px #ffbb5c9",
          background: `conic-gradient(var(--color-accent) ${percentage}%, var(--color-base-secondary) ${percentage}% 100%)`,
          padding: "1rem",
        }}
      >
        <div className="bg-base-primary rounded-full aspect-square h-full flex items-center justify-center flex-col">
          <h2 className="text-2xl text-primary ">{usedGB.toFixed(1)}GB</h2>
          <p className="text-secondary">of {maxGB.toFixed(1)}GB Used</p>
        </div>
      </div>
      <Button variant={"secondary"}>
        <Icon icon="hugeicons:clean" className="text-secondary 2xl" />
        Clean Up
      </Button>
    </div>
  );
}

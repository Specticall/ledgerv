import CreateResourceDialog from "./components/folders/CreateResourceDialog";
import RenameResourceDialog from "./components/folders/RenameResourceDialog";
import type { DialogComponents } from "./components/ui/Dialog";

export const dialogs = [
  {
    name: "create-resource",
    component: <CreateResourceDialog />,
  },
  {
    name: "rename-resource",
    component: <RenameResourceDialog />,
  },
] as const satisfies DialogComponents;
export type DialogComponentList = typeof dialogs;

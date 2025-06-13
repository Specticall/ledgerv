import { RouterProvider } from "react-router-dom";
import router from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GOOGLE_CLIENT_ID } from "./lib/config";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "./components/ui/Sonner";
import { DialogProvider } from "./components/ui/Dialog";
import { dialogs } from "./dialog";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <SkeletonTheme baseColor="#202024" highlightColor="#2a2c36">
          <DialogProvider components={dialogs}>
            <RouterProvider router={router} />
            <Toaster />
          </DialogProvider>
        </SkeletonTheme>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

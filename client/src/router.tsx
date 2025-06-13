import { createBrowserRouter } from "react-router-dom";
import PageLogin from "./pages/PageLogin";
import PageLayout from "./pages/PageLayout";
import PageFolder from "./pages/PageFolder";
import PageDashboard from "./pages/PageDashboard";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <PageLogin />,
  },
  {
    path: "/",
    element: <PageLayout />,
    children: [
      {
        path: "folders/:resourceId?",
        element: <PageFolder />,
      },
      {
        path: "dashboard",
        element: <PageDashboard />,
      },
    ],
  },
]);

export default router;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { QueryClient, QueryClientProvider } from "react-query";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Quiz from "./Quiz.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "quiz/:id",
        element: <Quiz />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

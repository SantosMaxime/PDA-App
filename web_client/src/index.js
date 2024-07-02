import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./routes/App";
import UserTable from "./routes/UserTable";
import ErrorPage from "./routes/ErrorPage";
import LoginPage from "./routes/LoginPage";
import { UserProvider } from "./context/UserContext";
import { AppProvider } from "./context/AppContext";
import { SpotifyProvider } from "./context/SpotifyContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { SnackbarProvider } from "notistack";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingPage from "./routes/LoadingPage";

const router = createBrowserRouter([
    {
        element: <LoginPage />,
        path: "/login",
        errorElement: <ErrorPage />,
    },
    {
        element: (
            <ProtectedRoute>
                {/*<LoadingPage>*/}
                    <App />
                {/*</LoadingPage>*/}
            </ProtectedRoute>
        ),
        path: "/",
        errorElement: <ErrorPage />,
    },
    {
        element: (
            <ProtectedRoute>
                {/*<LoadingPage>*/}
                    <UserTable />
                {/*</LoadingPage>*/}
            </ProtectedRoute>
        ),
        path: "/users",
        errorElement: <ErrorPage />,
    },
    {
        element: <ErrorPage />,
        path: "*",
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <UserProvider>
            <AppProvider>
                <SpotifyProvider>
                    <SnackbarProvider maxSnack={3}>
                        <RouterProvider router={router}></RouterProvider>
                    </SnackbarProvider>
                </SpotifyProvider>
            </AppProvider>
        </UserProvider>
    </React.StrictMode>,
);

reportWebVitals();

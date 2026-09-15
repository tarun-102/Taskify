import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout"; 
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import ProfileSettings from "../pages/ProfileSettings";
import ChangePassword from "../pages/ChangePassword"; 
import Tasks from "../pages/Tasks"
import Projects from "../pages/Projects"; 
import ProjectDetails from "../pages/ProjectDetails"; 
import TaskDetails from "../pages/TaskDetails";
import CalendarPage from "../pages/CalendarPage";
import NotificationsPage from "../pages/NotificationsPage";

export const router = createBrowserRouter([
  // Public / Auth Routes
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true, 
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },

  // Protected 
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />, 
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/projects",
            element: <Projects />,
          },
          {
            path: "/projects/:id",
            element: <ProjectDetails />,
          },
          {
            path: "/settings", 
            element: <ProfileSettings />,
          },
          {
            path: "/settings/change-password", 
            element: <ChangePassword />,
          },
          {
            path: "/tasks",
            element: <Tasks />,
          },
          {
            path: "/tasks/:id",
            element: <TaskDetails />
          },

          {
            path: "/calendar",
            element: <CalendarPage />
          },

          {
            path: "/notifications",
            element: <NotificationsPage />
          }
        ],
      },
    ],
  },

  // Wildcard 404 Route
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
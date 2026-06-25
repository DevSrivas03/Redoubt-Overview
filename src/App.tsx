import React from "react";
import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { AppThemeProvider } from "ds/index";
import { CssBaseline } from "@mui/material";
import { DashboardShell } from "@/layout/DashboardShell";
import { OverviewPage } from "./pages/OverviewPage";

const useHashRouter = process.env.USE_HASH_ROUTER === "true";
const Router = useHashRouter ? HashRouter : BrowserRouter;

export default function App(): React.ReactElement {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <Router basename={useHashRouter ? undefined : process.env.BASE_PATH}>
        <DashboardShell activeRoute="overview">
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<OverviewPage />} />
          </Routes>
        </DashboardShell>
      </Router>
    </AppThemeProvider>
  );
}

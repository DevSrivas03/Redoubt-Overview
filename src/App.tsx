import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppThemeProvider } from "ds/index";
import { CssBaseline } from "@mui/material";
import { DashboardShell } from "@/layout/DashboardShell";
import { OverviewPage } from "./pages/OverviewPage";

export default function App(): React.ReactElement {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <BrowserRouter basename={process.env.BASE_PATH}>
        <DashboardShell activeRoute="overview">
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<OverviewPage />} />
          </Routes>
        </DashboardShell>
      </BrowserRouter>
    </AppThemeProvider>
  );
}

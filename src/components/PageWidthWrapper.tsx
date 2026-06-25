import React from "react";
import { PageSurface } from "ds/index";

interface PageWidthWrapperProps {
  children: React.ReactNode;
}

/** Constrains page content to the DS "cards" width — matches fe-monitor overview. */
export function PageWidthWrapper({
  children,
}: PageWidthWrapperProps): React.ReactElement {
  return <PageSurface contentWidth="cards">{children}</PageSurface>;
}

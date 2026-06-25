import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Box, IconButton } from "ds/index";
import { Minus, Plus } from "lucide-react";
import { DS } from "@/lib/dsTokens";
import type { MapNode } from "@/types/overview";
import {
  MAP_MARKER_CSS,
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_URL,
  createMarkerHtml,
  createPopupHtml,
} from "@/components/map/mapMarkerStyles";

const MIN_ZOOM = 2;
const MAX_ZOOM = 7;
const DEFAULT_ZOOM = 2;

function markerSize(node: MapNode): number {
  if (node.riskLevel === "extreme") return 56;
  if (node.riskLevel === "high") return 44;
  if (node.riskLevel === "medium") return 36;
  return 28;
}

function createNodeIcon(node: MapNode): L.DivIcon {
  const size = markerSize(node);
  const half = size / 2;

  return L.divIcon({
    className: "overview-marker-icon",
    iconSize: [size, size],
    iconAnchor: [half, half],
    popupAnchor: [0, -half + 6],
    html: createMarkerHtml(node),
  });
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

interface DashboardMapLayerProps {
  nodes: MapNode[];
}

export function DashboardMapLayer({
  nodes,
}: DashboardMapLayerProps): React.ReactElement {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<L.Map | null>(null);
  const markersRef = React.useRef<L.Marker[]>([]);
  const [zoom, setZoom] = React.useState(DEFAULT_ZOOM);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return undefined;

    const map = L.map(container, {
      zoomControl: false,
      attributionControl: true,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      scrollWheelZoom: true,
    }).setView([28, 8], DEFAULT_ZOOM);

    L.tileLayer(MAP_TILE_URL, {
      attribution: MAP_TILE_ATTRIBUTION,
      subdomains: "abcd",
      maxZoom: MAX_ZOOM,
    }).addTo(map);

    map.on("zoomend", () => setZoom(map.getZoom()));
    mapRef.current = map;

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);

    return () => {
      observer.disconnect();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = nodes.map((node) => {
      const marker = L.marker([node.lat, node.lng], {
        icon: createNodeIcon(node),
        title: `${node.name} — ${node.riskLevel} risk`,
      });
      marker.bindPopup(createPopupHtml(node), {
        closeButton: true,
        maxWidth: 240,
        className: "overview-map-popup-container",
      });
      marker.addTo(map);
      return marker;
    });

    if (nodes.length > 0) {
      const bounds = L.latLngBounds(nodes.map((n) => [n.lat, n.lng] as [number, number]));
      map.fitBounds(bounds.pad(0.35), { animate: !prefersReducedMotion() });
      setZoom(map.getZoom());
    }
  }, [nodes]);

  const zoomBy = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    const next = map.getZoom() + delta;
    if (next < MIN_ZOOM || next > MAX_ZOOM) return;
    if (delta > 0) {
      map.zoomIn();
    } else {
      map.zoomOut();
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        isolation: "isolate",
        backgroundColor: DS.surfaceContainerLow,
      }}
    >
      <Box component="style">{MAP_MARKER_CSS}</Box>

      <Box
        ref={containerRef}
        role="region"
        aria-label="Global supply chain map. Use zoom buttons to adjust map scale."
        tabIndex={0}
        sx={{
          width: "100%",
          height: "100%",
          filter: "grayscale(0.35) contrast(0.92) brightness(1.03)",
          "&:focus-visible": {
            outline: `2px solid ${DS.primary}`,
            outlineOffset: -2,
          },
          "& .leaflet-container": {
            fontFamily: DS.fontFamily,
            background: DS.surfaceContainerLow,
          },
        }}
      />

      {/* Soft fade into widget layer */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: "auto 0 0 0",
          height: { xs: 80, sm: 120 },
          zIndex: 450,
          pointerEvents: "none",
          background: `linear-gradient(to bottom, transparent, ${DS.surface})`,
        }}
      />

      {/* Zoom controls */}
      <Box
        component="div"
        role="group"
        aria-label="Map zoom controls"
        sx={{
          position: "absolute",
          right: "var(--md)",
          bottom: "var(--md)",
          zIndex: 500,
          display: "flex",
          flexDirection: "column",
          borderRadius: "var(--corner-small)",
          overflow: "hidden",
          boxShadow: "var(--elevation-2)",
          backgroundColor: DS.surface,
          border: `1px solid ${DS.outlineVariant}`,
        }}
      >
        <IconButton
          size="small"
          aria-label="Zoom in on map"
          disabled={zoom >= MAX_ZOOM}
          onClick={() => zoomBy(1)}
          sx={{
            width: 44,
            height: 44,
            borderRadius: 0,
            color: DS.onSurfaceVariant,
            "&:hover": { backgroundColor: DS.surfaceContainerLow },
            "&:focus-visible": {
              outline: `2px solid ${DS.primary}`,
              outlineOffset: -2,
            },
          }}
        >
          <Plus size={18} aria-hidden />
        </IconButton>
        <Box sx={{ height: 1, backgroundColor: DS.outlineVariant }} aria-hidden />
        <IconButton
          size="small"
          aria-label="Zoom out on map"
          disabled={zoom <= MIN_ZOOM}
          onClick={() => zoomBy(-1)}
          sx={{
            width: 44,
            height: 44,
            borderRadius: 0,
            color: DS.onSurfaceVariant,
            "&:hover": { backgroundColor: DS.surfaceContainerLow },
            "&:focus-visible": {
              outline: `2px solid ${DS.primary}`,
              outlineOffset: -2,
            },
          }}
        >
          <Minus size={18} aria-hidden />
        </IconButton>
      </Box>

      <Box
        className="sr-only"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        <ul>
          {nodes.map((node) => (
            <li key={node.id}>
              {node.name}: {node.riskLevel} risk
              {node.tier ? `, tier ${node.tier}` : ""}
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
}

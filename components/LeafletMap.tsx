"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMapInstance } from "leaflet";
import "leaflet/dist/leaflet.css";
import { brand } from "@/data/barbershopData";

/** Dark map with a pulsing gold marker. Leaflet loads client-side only. */
export function LeafletMap({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: LeafletMapInstance | null = null;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;
      const { lat, lng } = brand.coords;
      const touch = window.matchMedia("(pointer: coarse)").matches;

      map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 16,
        scrollWheelZoom: false,
        // One-finger drags should scroll the page on phones, not pan the map.
        dragging: !touch,
        zoomControl: true,
        attributionControl: true,
      });

      // Esri Dark Gray Canvas: keyless (CARTO's Dark Matter now requires an API key).
      const esri = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
      const tileOptions = { maxNativeZoom: 16, maxZoom: 19 };
      L.tileLayer(`${esri}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
        ...tileOptions,
        className: "fade-map-base",
        attribution:
          'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      L.tileLayer(`${esri}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, tileOptions).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: '<div class="fade-marker" style="width:18px;height:18px"><span class="fade-marker__ring"></span><span class="fade-marker__dot"></span></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      L.marker([lat, lng], { icon, title: brand.name, keyboard: false })
        .addTo(map)
        .bindTooltip(brand.shortName, { permanent: true, direction: "top", offset: [0, -14], className: "fade-tooltip" });
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`Hartă: ${brand.name}, ${brand.address}`}
      className={className}
    />
  );
}

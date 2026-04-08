import { useEffect, useRef, useMemo } from 'react';
import type { Property } from '@/types/chat';
import { useChatStore } from '@/store/chatStore';

declare const ymaps3: any;

const formatShortPrice = (n: number) => `${(n / 1_000_000).toFixed(1)}М ₽`;

const CatalogMap = ({ properties }: { properties: Property[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const selectProperty = useChatStore((s) => s.selectProperty);

  const geoProperties = useMemo(
    () => properties.filter((p) => p.lat != null && p.lng != null),
    [properties]
  );

  // Init map
  useEffect(() => {
    if (!containerRef.current || typeof ymaps3 === 'undefined') return;

    let destroyed = false;

    const init = async () => {
      await ymaps3.ready;
      if (destroyed || !containerRef.current) return;

      const center = geoProperties.length > 0
        ? [geoProperties[0].lng!, geoProperties[0].lat!]
        : [37.6173, 55.7558]; // Moscow default

      const map = new ymaps3.YMap(containerRef.current, {
        location: { center, zoom: 10 },
      });

      map.addChild(new ymaps3.YMapDefaultSchemeLayer({}));
      map.addChild(new ymaps3.YMapDefaultFeaturesLayer({}));

      mapRef.current = map;

      // Add markers
      updateMarkers(geoProperties);
    };

    const updateMarkers = (props: Property[]) => {
      const map = mapRef.current;
      if (!map) return;

      // Remove old markers
      markersRef.current.forEach((m) => map.removeChild(m));
      markersRef.current = [];

      props.forEach((p) => {
        if (p.lat == null || p.lng == null) return;

        const el = document.createElement('div');
        el.className = 'ymaps-price-marker';
        el.innerHTML = `<div style="
          background: hsl(221 83% 53%);
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          white-space: nowrap;
          transform: translate(-50%, -100%);
        ">${formatShortPrice(p.price)}</div>
        <div style="
          width: 0; height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid hsl(221 83% 53%);
          margin: 0 auto;
          transform: translateX(0);
        "></div>`;

        el.addEventListener('click', () => selectProperty(p));

        const marker = new ymaps3.YMapMarker(
          { coordinates: [p.lng!, p.lat!] },
          el
        );

        map.addChild(marker);
        markersRef.current.push(marker);
      });
    };

    init();

    return () => {
      destroyed = true;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
      markersRef.current = [];
    };
  }, []);

  // Update markers when properties change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old
    markersRef.current.forEach((m) => {
      try { map.removeChild(m); } catch {}
    });
    markersRef.current = [];

    geoProperties.forEach((p) => {
      if (p.lat == null || p.lng == null) return;

      const el = document.createElement('div');
      el.innerHTML = `<div style="
        background: hsl(221 83% 53%);
        color: white;
        font-size: 11px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        white-space: nowrap;
        transform: translate(-50%, -100%);
      ">${formatShortPrice(p.price)}</div>
      <div style="
        width: 0; height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid hsl(221 83% 53%);
        margin: 0 auto;
      "></div>`;

      el.addEventListener('click', () => selectProperty(p));

      const marker = new ymaps3.YMapMarker(
        { coordinates: [p.lng!, p.lat!] },
        el
      );

      map.addChild(marker);
      markersRef.current.push(marker);
    });
  }, [geoProperties, selectProperty]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default CatalogMap;

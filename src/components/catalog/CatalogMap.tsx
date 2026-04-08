import { useEffect, useRef, useMemo } from 'react';
import type { Property } from '@/types/chat';
import { useChatStore } from '@/store/chatStore';

declare const ymaps3: any;

const CatalogMap = ({ properties }: { properties: Property[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const selectProperty = useChatStore((s) => s.selectProperty);

  const geoProperties = useMemo(
    () => properties.filter((p) => p.lat != null && p.lng != null),
    [properties]
  );

  const createMarkerElement = (p: Property) => {
    const el = document.createElement('div');
    el.style.cssText = 'cursor:pointer;transform:translate(-50%,-50%);';

    el.innerHTML = `
      <div style="
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 3px solid hsl(38 92% 55%);
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0,0,0,0.4);
        transition: transform 0.2s, box-shadow 0.2s;
      ">
        <img
          src="${p.image}"
          alt="${p.title}"
          style="width:100%;height:100%;object-fit:cover;"
        />
      </div>
    `;

    el.addEventListener('mouseenter', () => {
      const inner = el.firstElementChild as HTMLElement;
      if (inner) {
        inner.style.transform = 'scale(1.25)';
        inner.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
      }
    });
    el.addEventListener('mouseleave', () => {
      const inner = el.firstElementChild as HTMLElement;
      if (inner) {
        inner.style.transform = 'scale(1)';
        inner.style.boxShadow = '0 2px 12px rgba(0,0,0,0.4)';
      }
    });

    el.addEventListener('click', () => selectProperty(p));
    return el;
  };

  // Init map
  useEffect(() => {
    if (!containerRef.current || typeof ymaps3 === 'undefined') return;

    let destroyed = false;

    const init = async () => {
      await ymaps3.ready;
      if (destroyed || !containerRef.current) return;

      const center = geoProperties.length > 0
        ? [geoProperties[0].lng!, geoProperties[0].lat!]
        : [37.6173, 55.7558];

      const map = new ymaps3.YMap(containerRef.current, {
        location: { center, zoom: 10 },
      });

      map.addChild(new ymaps3.YMapDefaultSchemeLayer({}));
      map.addChild(new ymaps3.YMapDefaultFeaturesLayer({}));

      mapRef.current = map;
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

    markersRef.current.forEach((m) => {
      try { map.removeChild(m); } catch {}
    });
    markersRef.current = [];

    geoProperties.forEach((p) => {
      const el = createMarkerElement(p);
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

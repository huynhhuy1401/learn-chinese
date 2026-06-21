'use client';

import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Compass, ChevronRight, Lock } from 'lucide-react';

const PROVINCES_QUERY = gql`
  query Provinces {
    provinces {
      id
      name
      capital
      unlockOrder
      color
      culturalDescription
      food
      landmark
    }
  }
`;

const PROGRESS_QUERY = gql`
  query UserProgress {
    userProgress {
      provinceId
      completed
      score
    }
  }
`;

// Map GeoJSON Chinese names → DB English names
const geoToDbName: Record<string, string> = {
  '北京市': 'Beijing',
  '陕西省': 'Shaanxi',
  '四川省': 'Sichuan',
  '上海市': 'Shanghai',
  '云南省': 'Yunnan',
  '广东省': 'Guangdong',
  '河南省': 'Henan',
  '新疆维吾尔自治区': 'Xinjiang',
  '香港特别行政区': 'Hong Kong',
};

export default function MapPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
    });
  }, []);

  const { data: provincesData, loading: provincesLoading } = useQuery(PROVINCES_QUERY);
  const { data: progressData } = useQuery(PROGRESS_QUERY, { skip: !userId });

  const provinces = provincesData?.provinces ?? [];
  const progress = progressData?.userProgress ?? [];
  const completedIds = new Set(progress.filter((p: any) => p.completed).map((p: any) => p.provinceId));

  const getProvinceStatus = (geoName: string) => {
    const dbName = geoToDbName[geoName];
    if (!dbName) return { status: 'inactive', province: null };
    const province = provinces.find((p: any) => p.name === dbName);
    if (!province) return { status: 'inactive', province: null };
    if (completedIds.has(province.id)) return { status: 'completed', province };
    if (province.unlockOrder === 1) return { status: 'available', province };
    const prevProvince = provinces.find((p: any) => p.unlockOrder === province.unlockOrder - 1);
    if (prevProvince && completedIds.has(prevProvince.id)) return { status: 'available', province };
    return { status: 'locked', province };
  };

  const completedCount = completedIds.size;

  if (provincesLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Compass className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold">Your Journey Through China</h1>
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Travel province by province. Learn Chinese through food, landmarks, and local customs.
        </p>
        {userId && (
          <p className="text-sm mt-2 font-medium text-red-600">
            🗺️ {completedCount}/{provinces.length} provinces explored
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* The Map */}
        <Card className="p-2 overflow-hidden bg-[#f0f4f8] dark:bg-zinc-900">
          <div style={{ width: '100%', aspectRatio: '4/3' }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 600,
                center: [104, 37],
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <ZoomableGroup zoom={1} maxZoom={4} center={[0, 0]}>
                <Geographies geography="/china-geo.json">
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const geoName = geo.properties.name;
                      const { status, province } = getProvinceStatus(geoName);
                      const isHighlighted = province && selectedProvince?.id === province.id;

                      let fill = '#e5e7eb';
                      let strokeWidth = 0.8;
                      let cursor = 'default';
                      let opacity = 0.6;

                      if (status === 'locked') {
                        fill = '#d1d5db';
                        opacity = 0.35;
                        cursor = 'not-allowed';
                      } else if (status === 'completed') {
                        fill = province?.color ?? '#22c55e';
                        opacity = 0.85;
                        cursor = 'pointer';
                        strokeWidth = 1.2;
                      } else if (status === 'available') {
                        fill = province?.color ?? '#ef4444';
                        opacity = 0.75;
                        cursor = 'pointer';
                        strokeWidth = 1.8;
                      }

                      if (isHighlighted) {
                        strokeWidth = 3;
                        opacity = 1;
                      }

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fill}
                          stroke="#ffffff"
                          strokeWidth={strokeWidth}
                          opacity={opacity}
                          style={{
                            default: { outline: 'none' },
                            hover: province
                              ? { outline: 'none', opacity: 1, strokeWidth: 2.5 }
                              : { outline: 'none' },
                            pressed: { outline: 'none' },
                          }}
                          onClick={() => {
                            if (!province || status === 'locked') return;
                            setSelectedProvince(province);
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {selectedProvince ? (
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedProvince.color }}
                />
                <h2 className="text-xl font-bold">{selectedProvince.name}</h2>
                <Badge variant="outline">{selectedProvince.capital}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                {selectedProvince.culturalDescription}
              </p>
              <div className="space-y-2 text-sm mb-4">
                <div>
                  <span className="font-medium">🏛️ {selectedProvince.landmark}</span>
                </div>
                <div>
                  <span className="font-medium">🍜 {selectedProvince.food}</span>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => router.push(`/provinces/${selectedProvince.id}`)}
              >
                Explore {selectedProvince.name} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>
          ) : (
            <Card className="p-5 text-center">
              <Compass className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">
                Click a colored province on the map to start your journey!
              </p>
            </Card>
          )}

          {/* Route progress */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-sm">Your Route</h3>
            <div className="space-y-1">
              {[...provinces]
                .sort((a: any, b: any) => a.unlockOrder - b.unlockOrder)
                .map((p: any) => {
                  const isCompleted = completedIds.has(p.id);
                  const isLocked =
                    !isCompleted &&
                    p.unlockOrder > 1 &&
                    !completedIds.has(
                      provinces.find((x: any) => x.unlockOrder === p.unlockOrder - 1)?.id,
                    );
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer transition-colors ${
                        selectedProvince?.id === p.id
                          ? 'bg-muted font-medium'
                          : isLocked
                            ? 'text-muted-foreground'
                            : 'hover:bg-muted/50'
                      }`}
                      onClick={() => {
                        if (!isLocked) setSelectedProvince(p);
                      }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: isCompleted
                            ? '#22c55e'
                            : isLocked
                              ? '#d1d5db'
                              : p.color,
                        }}
                      />
                      <span>{isLocked && <Lock className="w-3 h-3 inline mr-1" />}{p.name}</span>
                      {isCompleted && <Badge variant="secondary" className="ml-auto text-xs">✓</Badge>}
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

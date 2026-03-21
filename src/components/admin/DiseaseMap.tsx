'use client';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMemo } from 'react';

// Mock outbreak data for Ahmedabad region
const outbreaks = [
    { id: 1, lat: 23.03, lng: 72.58, cases: 15, type: 'Dengue Suspected' },
    { id: 2, lat: 23.05, lng: 72.56, cases: 8, type: 'Malaria Confirmed' },
    { id: 3, lat: 23.01, lng: 72.50, cases: 12, type: 'Viral Fever Outbreak' },
    { id: 4, lat: 23.04, lng: 72.60, cases: 20, type: 'Typhoid Clusters' },
    { id: 5, lat: 23.02, lng: 72.54, cases: 6, type: 'Cholera Warning' },
];

export default function DiseaseMap() {
    const center: [number, number] = [23.0225, 72.5714];

    return (
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative group min-h-[500px] bg-slate-950">
            {/* Status Indicator */}
            <div className="absolute top-8 left-8 z-[1000]">
                <div className="bg-white/95 backdrop-blur-md px-8 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black tracking-[0.3em] text-slate-800 uppercase">Live Hotspots</span>
                </div>
            </div>

            <MapContainer 
                center={center} 
                zoom={12} 
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                
                {outbreaks.map((hotspot) => (
                    <CircleMarker
                        key={hotspot.id}
                        center={[hotspot.lat, hotspot.lng]}
                        radius={12 + (hotspot.cases * 1.5)}
                        pathOptions={{ 
                            fillColor: '#ef4444', 
                            fillOpacity: 0.5, 
                            color: '#ef4444', 
                            weight: 1,
                            stroke: false 
                        }}
                    >
                        <Tooltip 
                            direction="top" 
                            offset={[0, -10]} 
                            opacity={1} 
                        >
                            <div className="p-3 bg-white rounded-2xl shadow-xl min-w-[150px] text-center border-none overflow-hidden">
                                <h4 className="text-slate-900 font-black text-xs uppercase tracking-tight mb-1">{hotspot.type}</h4>
                                <div className="text-rose-600 font-bold text-[10px] bg-rose-50 py-1 rounded-full px-4 inline-block uppercase tracking-wider">
                                    {hotspot.cases} Active Cases
                                </div>
                            </div>
                        </Tooltip>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
}

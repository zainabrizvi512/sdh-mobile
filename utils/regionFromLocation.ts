type Zone = { code: string; minLat: number; maxLat: number; minLng: number; maxLng: number };

// Bounding boxes for major Pakistani cities. Falls back to PK-ISB (the only
// region currently seeded with risk data on the backend) outside these.
const ZONES: Zone[] = [
  { code: 'PK-ISB', minLat: 33.4, maxLat: 33.9, minLng: 72.8, maxLng: 73.3 }, // Islamabad/Rawalpindi
  { code: 'PK-KHI', minLat: 24.7, maxLat: 25.1, minLng: 66.9, maxLng: 67.5 }, // Karachi
  { code: 'PK-LHR', minLat: 31.3, maxLat: 31.7, minLng: 74.1, maxLng: 74.5 }, // Lahore
  { code: 'PK-PEW', minLat: 33.9, maxLat: 34.1, minLng: 71.4, maxLng: 71.7 }, // Peshawar
  { code: 'PK-UET', minLat: 30.1, maxLat: 30.3, minLng: 66.9, maxLng: 67.1 }, // Quetta
];

export function regionFromLatLng(lat: number, lng: number): string {
  const zone = ZONES.find(z => lat > z.minLat && lat < z.maxLat && lng > z.minLng && lng < z.maxLng);
  return zone?.code ?? 'PK-ISB';
}

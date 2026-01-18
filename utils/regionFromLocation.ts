export function regionFromLatLng(lat: number, lng: number): string {
  const inISB = lat > 33.4 && lat < 33.9 && lng > 72.8 && lng < 73.3;
  if (inISB) return 'PK-ISB';
  return 'PK-ISB';
}

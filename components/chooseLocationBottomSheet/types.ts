export type PopularPlace = {
    id: string;
    title: string;
    subtitle?: string;
    distanceKm: number;
    lat: number;
    lng: number;
};

export type ChooseLocationBottomSheetProps = {
    snapPoints: (string | number)[];
    onClose?: (refresh?: boolean) => void;
    items?: PopularPlace[];      // popular/nearby list
    loading?: boolean;
    city?: string;
    onSelectPlace?: (place: PopularPlace) => void;
    anchorLat?: number;          // 👈 current map center
    anchorLng?: number;          // 👈 current map center
};
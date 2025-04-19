export interface Facility {
    id: string;
    name: string;
}

export interface Room {
    id: string;
    roomNumber: string;
    type: string;
    price: number;
    facilities: Facility[];
}

export interface Hotel {
    id: string;
    name: string;
    city: string;
    category: string;
    availableFromDate: string;
    rooms: Room[];
    rating: number;
    imageUrl: string;
}

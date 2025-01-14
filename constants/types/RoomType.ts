import { SeatProps, SeatType } from "@/src/redux/adminSlice"
import { Address } from "./AddressType"
import { StatusType } from "./StatusType"

export interface RoomType {
    _id: string,
    theatreId: string,
    location: {
        province: Address<'Province'> | null,
        district: Address<'District'> | null,
        street: string | null,
        lat: number | null,
        lng: number | null,
    },
    roomType: string,
    roomName: string,
    totalSeats: number,
    map2d: SeatProps[][],
    prices: { seatType: string, price: number }[],
    status: StatusType
}
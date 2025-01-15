import { SeatProps, SeatType } from "@/src/redux/adminSlice"
import { Address } from "./AddressType"
import { StatusType } from "./StatusType"

export interface RoomType {
    _id: string,
    theatreId: string,
    roomType: '2D' | '3D' | 'IMAX',
    roomName: string,
    totalSeats: number,
    map2d: SeatProps[][],
    prices: { seatType: string, price: number }[],
    status: StatusType
}
import { SeatProps } from "@/src/redux/adminSlice"
import { Address } from "./types/AddressType"

export interface CinemaMapType {
    name: string,
    address: {
        province: Address<'Province'>,
        district: Address<'District'>,
        ward: Address<'Ward'>,
        lat: number,
        long: number
    },
    totalSeats: number,
    map2d: {
        totalRows: number,
        totalCols: number,
        data: Array<Array<SeatProps>>
    },
    status: boolean,
}
import { SeatProps } from "@/src/redux/adminSlice"
import { Address } from "./AddressType"

export interface TheatreType {
    _id: string,
    name: string,
    location: {
        province: Address<'Province'> | null,
        district: Address<'District'> | null,
        street: string | null,
        lat: number | null,
        lng: number | null,
    },
    // totalSeats: number,
    // map2d: {
    //     rows: number | null,
    //     cols: number | null,
    //     maps: SeatProps[][] | null
    // }
}

export interface SeatData {
    row: number,
    col: number
}
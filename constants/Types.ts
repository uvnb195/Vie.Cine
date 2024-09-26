import { SeatProps } from "@/src/redux/paymentSlice"

export interface CinemaMapType {
    totalSeats: number,
    availableSeats: number,
    map: {
        totalRows: number,
        totalCols: number,
        data: Array<Array<SeatProps>>
    }
}
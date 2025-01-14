
// seat = A1
// from = A4

import { SeatProps, SeatType } from "@/src/redux/adminSlice";

// to = B15
export const checkSeatInRange = (
    seat: SeatProps,
    from: string,
    to: string) => {
    if (seat.seatType === SeatType.EMPTY) return false
    if (seat.seatCode === from || seat.seatCode === to) return true
    else if (seat.seatCode.length === 0 || from.length === 0 || to.length === 0) return false
    const seatRow = seat.seatCode.charCodeAt(0) - 65;
    const seatCol = parseInt(seat.seatCode.slice(1)) - 1;
    const fromRow = from.charCodeAt(0) - 65;
    const fromCol = parseInt(from.slice(1)) - 1;
    const toRow = to.charCodeAt(0) - 65;
    const toCol = parseInt(to.slice(1)) - 1;
    if (fromRow === toRow && seatRow === fromRow) {
        if (seatCol >= fromCol && seatCol <= toCol)
            return true
        else return false
    } else {
        if (seatRow === fromRow) {
            if (seatCol >= fromCol) return true
            else return false
        } else if (seatRow === toRow) {
            if (seatCol <= toCol) return true
            else return false
        } else if (seatRow > fromRow && seatRow < toRow)
            return true
        else return false
    }
};
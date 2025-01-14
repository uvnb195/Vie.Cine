import { SeatType } from "@/src/redux/adminSlice";

export const convertSeatTypeToString = (seatType: SeatType) => {
    switch (seatType) {
        case SeatType.VIP:
            return 'VIP'
        case SeatType.SWEET_BOX:
            return 'SWEET-BOX'
        case SeatType.STANDARD:
            return 'STANDARD'
        case SeatType.EMPTY:
            return 'EMPTY'
        case SeatType.UNAVAILABLE:
            return 'UNAVAILABLE'
        default:
            return ''
    }
}
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

export const convertStringToSeatType = (seatType: string) => {
    switch (seatType.toUpperCase()) {
        case 'VIP':
            return SeatType.VIP
        case 'SWEET-BOX':
            return SeatType.SWEET_BOX
        case 'STANDARD':
            return SeatType.STANDARD
        case 'EMPTY':
            return SeatType.EMPTY
        case 'UNAVAILABLE':
            return SeatType.UNAVAILABLE
        default:
            return SeatType.EMPTY
    }
}
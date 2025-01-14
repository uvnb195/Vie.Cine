import { PaletteType } from "@/constants/Colors"
import { SeatType } from "@/src/redux/adminSlice"

export const renderSeatColor = (
    seatType: SeatType,
    colors: PaletteType) => {
    switch (seatType) {
        case SeatType.STANDARD:
            return colors.zoomView.seats.standard
        case SeatType.VIP:
            return colors.zoomView.seats.vip
        case SeatType.SWEET_BOX:
            return colors.zoomView.seats['sweet-box']
        case SeatType.EMPTY:
            return 'transparent'
        case SeatType.UNAVAILABLE:
            return colors.zoomView.seats.unavailable
    }
}
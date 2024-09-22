export enum SeatType { VIP, SWEET_BOX, STANDARD, EMPTY }
export enum SeatStatus { AVAILABLE, RESERVED, SELECTED, EMPTY }

export interface SeatProps {
    seatType: SeatType,
    seatCode?: string,
    status?: SeatStatus
}

export interface CinemaMapType {
    totalSeats: number,
    availableSeats: number,
    map: {
        totalRows: number,
        totalCols: number,
        data: Array<Array<SeatProps>>
    }
}
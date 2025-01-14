export interface ScheduleType {
    _id: string,
    theatreId: string,
    movieId: string,
    runDate: Date,
    runTimes: {
        _id: string,
        time: Date,
        price: number,
        unavailableSeats: string[]
    }[],
    price: number,
    serviceIds: string | null,
}
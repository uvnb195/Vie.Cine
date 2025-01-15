import { StatusType } from "./StatusType";

export interface ScheduleType {
    _id?: string,
    theatreId: string,
    roomId: string,
    movieId: string,
    timeStart: Date,
    status: StatusType,
}
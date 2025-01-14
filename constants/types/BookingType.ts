import { ServiceType } from "./ServiceType";

export interface BookingType {
    _id?: string,
    userId?: string,
    movieScheduleId?: string,
    seats?: string[],
    selectedTime?: Date,
    services?: ServiceType[],
    price?: number,
}

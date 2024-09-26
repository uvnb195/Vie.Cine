import { createContext, ReactNode, useContext, useState } from "react";
import { SeatProps } from "../redux/paymentSlice";

enum PaymentStatus { pending, success, failed, editing }

interface PaymentType {
    time: string
    date: string,
    theater: string,
    seats: SeatProps[],
    services: any[],
    totalPrice: number,
}

interface PaymentContextType {
    time: string
    date: string,
    theater: string,
    seats: SeatProps[],
    services: any[],
    totalPrice: number,
    status: PaymentStatus,
    updateTime: (time: string) => void,
    updateDate: (date: string) => void,
    updateTheater: (theater: string) => void,
    updateSeats: (seats: SeatProps[]) => void,
    updateServices: (services: any[]) => void,
    updateTotalPrice: (totalPrice: number) => void,
    updateStatus: (status: PaymentStatus) => void,
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
    const value = useContext(PaymentContext)
    if (!value) throw new Error('usePayment must be wrapped in PaymentProvider')
    return value
}

const PaymentProvider = ({ children }: { children: ReactNode }) => {
    const [value, setValue] = useState<PaymentType>({
        time: '',
        date: '',
        theater: '',
        seats: [],
        services: [],
        totalPrice: 0
    })

    const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.editing)

    const isBlank = () => {
        return value.date === '' || value.time === '' || value.theater === '' || value.seats.length
    }

    const updateTime = (time: string) => {
        setValue({ ...value, time })
        if (!isBlank) {
            setStatus(PaymentStatus.pending)
        }
    }
    const updateDate = (date: string) => {
        setValue({ ...value, date })
        if (!isBlank) {
            setStatus(PaymentStatus.pending)
        }
    }
    const updateTheater = (theater: string) => {
        setValue({ ...value, theater })
        if (!isBlank) {
            setStatus(PaymentStatus.pending)
        }
    }
    const updateSeats = (seats: SeatProps[]) => {
        setValue({ ...value, seats })
        if (!isBlank) {
            setStatus(PaymentStatus.pending)
        }
    }
    const updateServices = (services: any[]) => {
        setValue({ ...value, services })
        if (!isBlank) {
            setStatus(PaymentStatus.pending)
        }
    }
    const updateTotalPrice = (totalPrice: number) => {
        setValue({ ...value, totalPrice })
        if (!isBlank) {
            setStatus(PaymentStatus.pending)
        }
    }
    const updateStatus = (status: PaymentStatus) => {
        setStatus(status)
    }

    return (
        <PaymentContext.Provider value={{ ...value, updateDate, updateSeats, updateServices, updateStatus, updateTheater, updateTime, updateTotalPrice, status }}>
            {children}
        </PaymentContext.Provider>
    )
}

export default PaymentProvider
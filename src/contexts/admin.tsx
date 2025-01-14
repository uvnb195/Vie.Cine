// import { createContext, ReactNode, useContext, useState } from "react";
// import { Status, SeatProps } from "../redux/adminSlice";

// interface PaymentType {
//     time: string
//     date: string,
//     theater: string,
//     seats: SeatProps[],
//     services: any[],
//     totalPrice: number,
// }

// interface PaymentContextType {
//     time: string
//     date: string,
//     theater: string,
//     seats: SeatProps[],
//     services: any[],
//     totalPrice: number,
//     status: Status,
//     updateTime: (time: string) => void,
//     updateDate: (date: string) => void,
//     updateTheater: (theater: string) => void,
//     updateSeats: (seats: SeatProps[]) => void,
//     updateServices: (services: any[]) => void,
//     updateTotalPrice: (totalPrice: number) => void,
//     updateStatus: (status: Status) => void,
// }

// const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// export const usePayment = () => {
//     const value = useContext(PaymentContext)
//     if (!value) throw new Error('usePayment must be wrapped in AdminProvider')
//     return value
// }

// const AdminProvider = ({ children }: { children: ReactNode }) => {
//     const [value, setValue] = useState<PaymentType>({
//         time: '',
//         date: '',
//         theater: '',
//         seats: [],
//         services: [],
//         totalPrice: 0
//     })

//     const [status, setStatus] = useState<Status>(Status.editing)

//     const isBlank = () => {
//         return value.date === '' || value.time === '' || value.theater === '' || value.seats.length
//     }

//     const updateTime = (time: string) => {
//         setValue({ ...value, time })
//         if (!isBlank) {
//             setStatus(Status.pending)
//         }
//     }
//     const updateDate = (date: string) => {
//         setValue({ ...value, date })
//         if (!isBlank) {
//             setStatus(Status.pending)
//         }
//     }
//     const updateTheater = (theater: string) => {
//         setValue({ ...value, theater })
//         if (!isBlank) {
//             setStatus(Status.pending)
//         }
//     }
//     const updateSeats = (seats: SeatProps[]) => {
//         setValue({ ...value, seats })
//         if (!isBlank) {
//             setStatus(Status.pending)
//         }
//     }
//     const updateServices = (services: any[]) => {
//         setValue({ ...value, services })
//         if (!isBlank) {
//             setStatus(Status.pending)
//         }
//     }
//     const updateTotalPrice = (totalPrice: number) => {
//         setValue({ ...value, totalPrice })
//         if (!isBlank) {
//             setStatus(Status.pending)
//         }
//     }
//     const updateStatus = (status: Status) => {
//         setStatus(status)
//     }

//     return (
//         <PaymentContext.Provider value={{ ...value, updateDate, updateSeats, updateServices, updateStatus, updateTheater, updateTime, updateTotalPrice, status }}>
//             {children}
//         </PaymentContext.Provider>
//     )
// }

// export default AdminProvider
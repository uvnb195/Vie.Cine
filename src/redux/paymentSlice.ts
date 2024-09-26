import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum PaymentStatus { pending, success, failed, editing }
export enum SeatType { VIP, SWEET_BOX, STANDARD, EMPTY, UNAVAILABLE }
export enum SeatStatus { AVAILABLE, RESERVED, SELECTED, EMPTY }

export interface SeatProps {
    seatType: SeatType,
    seatCode: string
}


export interface PaymentStates {
    time?: string
    date?: string,
    theater?: string,
    address: {
        street: string,
        city: string,
        district: string,
        theaterId: string,
    },
    cost: {
        standard: number,
        vip: number,
        sweetBox: number,
    },
    seats: SeatProps[],
    // will get from api
    services: {
        id: string,
        cost: number,
        quantity: number
    }[],
    totalAmount: number,
}

const initValue: PaymentStates = {
    time: '',
    date: '',
    theater: '',
    cost: {
        standard: 0,
        vip: 0,
        sweetBox: 0,
    },
    address: {
        street: '',
        city: '',
        district: '',
        theaterId: '',
    },
    seats: [],
    services: [],
    totalAmount: 0,
}

export const paymentSlice = createSlice({
    name: 'payment',
    initialState: initValue,
    reducers: {
        // update only city and district of address
        updateLocation: (
            state,
            action: PayloadAction<{ city: string, district: string }>) => {
            state.address = {
                ...state.address,
                city: action.payload.city,
                district: action.payload.district
            }
            console.log(state)
        },
        //update address => cost and services
        updateAddress: (
            state,
            action: PayloadAction<{
                street: string,
                city: string,
                district: string,
                theaterId: string,
                cost: {
                    standard: number,
                    vip: number,
                    sweetBox: number,
                },
                time: string
            }>) => {
            const { street, city, district, theaterId, cost } = action.payload
            state.address = { street, city, district, theaterId }
            state.cost = cost
            state.time = action.payload.time
        },
        //update seats => change totalAmount/reset services
        updateSeats: (
            state,
            action: PayloadAction<SeatProps[]>) => {
            state.seats = action.payload
            let amout = 0
            for (let i = 0; i < state.seats.length; i++) {
                switch (state.seats[i].seatType) {
                    case SeatType.VIP: {
                        amout += state.cost.vip
                        break
                    }
                    case SeatType.SWEET_BOX: {
                        amout += state.cost.sweetBox
                        break
                    }
                    case SeatType.STANDARD: {
                        amout += state.cost.standard
                        break
                    }
                    default: break
                }
            }
            state.totalAmount = amout
            state.services = []
        },
        //update services => change totalAmount
        updateServices: (
            state,
            action: PayloadAction<{
                id: string,
                cost: number,
                quantity: number
            }>) => {
            if (state.services.map(item => item.id).includes(action.payload.id)) {
                const index = state.services.map(item => item.id).findIndex(item => item === action.payload.id)
                const newValue = action.payload.quantity
                const oldValue = state.services[index].quantity
                if (newValue > oldValue) {
                    state.totalAmount += action.payload.cost * (newValue - oldValue)
                } else {
                    state.totalAmount -= action.payload.cost * (oldValue - newValue)
                }
                state.services[index].quantity = action.payload.quantity
            } else {
                state.services.push(action.payload)
                state.totalAmount += action.payload.cost
            }
        },
        resetState: (state) => {
            state.seats = []
        }
    },
})

export const {
    updateLocation,
    updateSeats,
    updateAddress,
    updateServices,
    resetState } = paymentSlice.actions
export default paymentSlice.reducer
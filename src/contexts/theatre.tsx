import { Address } from "@/constants/types/AddressType";
import { TheatreType } from "@/constants/types/TheatreType";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Modify } from "react-native-maps/lib/sharedTypesInternal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setLoading } from "../redux/publicSlice";

export interface AdminTheatreType extends Pick<
    TheatreType,
    'name' |
    'location'> { }

export interface TheatreErrorType extends Modify<AdminTheatreType, {
    name: string,
    location: {
        province: string,
        district: string,
        ward: string,
        street: string,
        lat: string,
        lng: string
    },
    totalSeats: string,
    // map2d: {
    //     rows: string,
    //     cols: string,
    //     maps: string
    // }
}> { }

interface AdminTheatre {
    editPage: number,
    data: AdminTheatreType,
    dataError: TheatreErrorType,
    handleData: (
        key: keyof AdminTheatreType,
        value: AdminTheatreType[keyof AdminTheatreType]) => void
}

const AdminTheatreContext = createContext<AdminTheatre | null>(null)

export const useAdminTheatre = () => {
    const value = useContext(AdminTheatreContext)
    if (!value) throw new Error('useAdminTheatre must be wrapped in AdminTheatreProvider')
    return value
}

const AdminTheatreProvider = (
    { children }: { children: ReactNode }) => {
    const [data, setData] = useState<AdminTheatre['data']>({
        name: '',
        location: {
            province: null,
            district: null,
            street: null,
            lat: null,
            lng: null
        }
    })
    const [dataError, setDataError] = useState<TheatreErrorType>({
        name: '',
        location: {
            province: 'Required',
            district: 'Required',
            ward: 'Required',
            street: 'Required',
            lat: 'Required',
            lng: 'Required'
        },
        totalSeats: ''
    })
    const [currentEditPage, setCurrentEditPage] = useState(0)
    const [submit, setSubmit] = useState(false)

    const handleData = (
        key: keyof AdminTheatre['data'],
        value: AdminTheatre['data'][keyof AdminTheatre['data']],
    ) => {
        if (key === 'location') {
            setCurrentEditPage(1)
        }
        // if (key === 'map2d') {
        //     console.log(value)
        //     setCurrentEditPage(2)
        //     const values = Object.values(value)
        //     if (values.filter(v => v !== null).length === 0) {
        //         setDataError({
        //             ...dataError,
        //             'map2d': {
        //                 rows: 'This field is required',
        //                 cols: 'This field is required',
        //                 maps: 'This field is required',
        //             }
        //         })
        //         setData({
        //             ...data,
        //             'map2d': {
        //                 rows: null,
        //                 cols: null,
        //                 maps: null
        //             }
        //         })
        //         return
        //     }
        //     const keys = Object.keys(value)
        //     let errs: { key: string, value: string }[] = []
        //     values.forEach((v, i) => {
        //         if (v === null) {
        //             errs.push({ key: keys[i], value: 'This field is required' })
        //         } else {
        //             errs.push({ key: keys[i], value: '' })
        //             setData({
        //                 ...data,
        //                 'map2d': {
        //                     ...data.map2d,
        //                     [keys[i]]: v
        //                 }
        //             })
        //         }
        //     })
        //     if (errs.filter(v => v.value.length == 0).length > 0) {
        //         const errObj = {
        //             [errs[0].key]: errs[0].value,
        //             [errs[1].key]: errs[1].value,
        //             [errs[2].key]: errs[2].value,
        //         }
        //         setDataError({
        //             ...dataError,
        //             'map2d': errObj as TheatreErrorType['map2d']
        //         })
        //         return
        //     } else {
        //         setDataError({
        //             ...dataError,
        //             'map2d': {
        //                 rows: '',
        //                 cols: '',
        //                 maps: ''
        //             }
        //         })
        //         setData({
        //             ...data,
        //             'map2d': value as AdminTheatre['data']['map2d']
        //         })
        //     }
        //     return
        // }
        setData({
            ...data,
            [key]: value
        })
        setDataError({
            ...dataError,
            [key]: (value === '' || value === null) ? 'This field is required' : ''
        })
    }

    return (
        <AdminTheatreContext.Provider
            value={{
                editPage: currentEditPage,
                data,
                dataError,
                handleData
            }}>
            {children}
        </AdminTheatreContext.Provider>
    )
}

export default AdminTheatreProvider
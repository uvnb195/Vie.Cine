import { ServiceType } from "@/constants/types/ServiceType";
import { createContext, ReactNode, useContext, useState } from "react";
import { err } from "react-native-svg";

interface ServiceError {
    image: boolean,
    title: string,
    price: string,
}

interface AdminService {
    data: ServiceType,
    error: ServiceError,
    handleData: (
        key: keyof ServiceType,
        value: ServiceType[keyof ServiceType]) => void
}

const AdminServiceContext = createContext<AdminService | null>(null);

export const useAdminService = () => {
    const value = useContext(AdminServiceContext)
    if (!value) throw new Error('useAdminService must be wrapped in AdminServiceProvider')
    return value
}

const AdminServiceProvider = (
    { children }: { children: ReactNode }) => {
    const [data, setData] = useState<ServiceType>({
        _id: '',
        title: '',
        description: '',
        price: 0,
        typeId: '',
        image: ''
    })
    const [error, setError] = useState<ServiceError>({
        image: true,
        title: 'Title is required',
        price: 'Price is required',
    })
    const handleData = (
        key: keyof ServiceType,
        value: ServiceType[keyof ServiceType]) => {
        switch (key) {
            case 'image': {
                const imageBase64 = value as string
                if (imageBase64.length == 0) {
                    setError({
                        ...error,
                        image: true
                    })
                    return
                } else {
                    setError({
                        ...error,
                        image: false
                    })
                    setData({
                        ...data,
                        image: imageBase64
                    })
                }
                break
            }
            case 'title': {
                const stringValue = value as string
                if (stringValue.length == 0) {
                    setError({
                        ...error,
                        title: 'Title is required'
                    })
                } else {
                    setError({
                        ...error,
                        title: ''
                    })
                    setData({
                        ...data,
                        title: stringValue
                    })
                }
                break
            }
            case 'price': {
                const numberValue = value as number
                if (numberValue == 0 || Number.isNaN(numberValue)) {
                    setError({
                        ...error,
                        price: 'Price is required'
                    })
                } else {
                    setError({
                        ...error,
                        price: ''
                    })
                    setData({
                        ...data,
                        price: numberValue
                    })
                }
                break
            }
            default: {
                setData({
                    ...data,
                    [key]: value
                })
            }
        }
    }
    return (
        <AdminServiceContext.Provider value={{
            data: data,
            error: error,
            handleData: handleData
        }}>
            {children}
        </AdminServiceContext.Provider>
    )
}

export default AdminServiceProvider
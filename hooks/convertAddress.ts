import { TheatreType } from "@/constants/types/TheatreType";


export const addressToString = (address: TheatreType['location'] | null) => {
    if (!address) return ''
    const {
        province,
        district,
        street
    } = address
    return `${street}, ${district?.name}, ${province?.name}`
}
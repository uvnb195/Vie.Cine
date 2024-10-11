type AddressType = 'Province' | 'District' | 'Ward'

export interface Address<T extends AddressType> {
    name: string,
    code: string,
    type: T
}
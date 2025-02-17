export interface ListResponse<T> {
    page: number;
    results?: (T)[] | null;
    total_pages: number;
    total_results: number;
}

export * from './MovieType'
export * from './PersonType'
export * from './UserType'
export * from './AddressType'
export * from './TheatreType'
export * from './RoomType'
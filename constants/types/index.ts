export interface ListResponse<T> {
    page: number;
    results?: (T)[] | null;
    total_pages: number;
    total_results: number;
}

export * from './MovieType'
export * from './PersonType'
export type PaginationResponse<T> = {
    lastPage: number;
    currentPage: number;
    total: number;
    from: number;
    to: number;
    data: T[];
}
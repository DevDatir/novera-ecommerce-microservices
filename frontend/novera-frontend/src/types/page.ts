export interface PageResponse<T> {
    content: T[];

    pageable: unknown;

    totalPages: number;

    totalElements: number;

    last: boolean;

    first: boolean;

    number: number;

    size: number;

    numberOfElements: number;

    empty: boolean;
}
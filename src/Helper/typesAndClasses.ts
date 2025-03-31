export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalEvents: number;
    limit: number;
    sortOrder: string; // Adjust to 'asc' | 'desc' if it's strictly one of these values
}


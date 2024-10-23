/**
 * Interface for pagination parameters
 */
interface PaginationParams {
  page?: number
  limit?: number
  totalItems: number
}

/**
 * Interface for pagination result
 */
interface PaginationResult {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextPage: number | null
  previousPage: number | null
  offset: number
  items: {
    start: number
    end: number
  }
}

/**
 * Pagination utility class for handling pagination logic in NextJS applications
 */
export class Pagination {
  private static readonly DEFAULT_PAGE = 1
  private static readonly DEFAULT_LIMIT = 10
  private static readonly MAX_LIMIT = 100

  /**
   * Calculate pagination details based on provided parameters
   * @param params PaginationParams object containing page, limit, and totalItems
   * @returns PaginationResult object with calculated pagination details
   */
  public static calculate(params: PaginationParams): PaginationResult {
    const page = Math.max(params.page ?? this.DEFAULT_PAGE, 1)
    const limit = Math.min(
      Math.max(params.limit ?? this.DEFAULT_LIMIT, 1),
      this.MAX_LIMIT
    )
    const totalItems = Math.max(params.totalItems, 0)
    const totalPages = Math.ceil(totalItems / limit)

    // Ensure page doesn't exceed total pages
    const currentPage = Math.min(page, Math.max(totalPages, 1))
    const offset = (currentPage - 1) * limit

    const hasNextPage = currentPage < totalPages
    const hasPreviousPage = currentPage > 1

    return {
      currentPage,
      totalPages,
      pageSize: limit,
      totalItems,
      hasNextPage,
      hasPreviousPage,
      nextPage: hasNextPage ? currentPage + 1 : null,
      previousPage: hasPreviousPage ? currentPage - 1 : null,
      offset,
      items: {
        start: totalItems === 0 ? 0 : offset + 1,
        end: Math.min(offset + limit, totalItems)
      }
    }
  }

  /**
   * Generate an array of page numbers for pagination UI
   * @param currentPage Current page number
   * @param totalPages Total number of pages
   * @param maxVisible Maximum number of visible page numbers
   * @returns Array of page numbers to display
   */
  public static getPageNumbers(
    currentPage: number,
    totalPages: number,
    maxVisible: number = 5
  ): (number | string)[] {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const halfVisible = Math.floor(maxVisible / 2)
    const pages: (number | string)[] = []

    // Always show first page
    pages.push(1)

    // Calculate start and end of visible pages
    let start = Math.max(currentPage - halfVisible, 2)
    let end = Math.min(currentPage + halfVisible, totalPages - 1)

    // Adjust if we're near the start
    if (start <= 2) {
      end = Math.min(maxVisible, totalPages - 1)
      start = 2
    }

    // Adjust if we're near the end
    if (end >= totalPages - 1) {
      start = Math.max(2, totalPages - maxVisible + 1)
      end = totalPages - 1
    }

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...')
    }

    // Add visible page numbers
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('...')
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  /**
   * Parse pagination parameters from URL search params
   * @param searchParams URLSearchParams object
   * @returns Object containing page and limit
   */
  public static parseSearchParams(searchParams: URLSearchParams): {
    page: number
    limit: number
  } {
    const page = Math.max(Number(searchParams.get('page')) || this.DEFAULT_PAGE, 1)
    const limit = Math.min(
      Math.max(Number(searchParams.get('limit')) || this.DEFAULT_LIMIT, 1),
      this.MAX_LIMIT
    )

    return { page, limit }
  }

  /**
   * Generate pagination meta tags for SEO
   * @param baseUrl Base URL of the page
   * @param pagination PaginationResult object
   * @returns Array of meta tag objects
   */
  public static generateMetaTags(
    baseUrl: string,
    pagination: PaginationResult
  ): Array<{ property: string; content: string }> {
    const tags: Array<{ property: string; content: string }> = []

    if (pagination.hasPreviousPage) {
      tags.push({
        property: 'prev',
        content: `${baseUrl}?page=${pagination.previousPage}`
      })
    }

    if (pagination.hasNextPage) {
      tags.push({
        property: 'next',
        content: `${baseUrl}?page=${pagination.nextPage}`
      })
    }

    return tags
  }
}

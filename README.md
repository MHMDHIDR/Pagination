### Pagination Utility Class Documentation

This is a utility class designed to handle pagination logic in NextJS applications. It provides methods for calculating pagination details, parsing pagination parameters from URL search parameters, and generating pagination meta tags for SEO purposes.

**Singleton Instance**

The class is designed as a singleton, ensuring only one instance of the PaginationService is created. This instance can be accessed through the `getInstance` method.

**Methods**

#### `calculate(params: PaginationParams): PaginationResult`

Calculates pagination details based on provided parameters. It validates the parameters, calculates the total pages, current page, offset, and other pagination details, and returns a `PaginationResult` object.

```typescript
parseSearchParams(searchParams: URLSearchParams): { page: number; limit: number }
```

Parses pagination parameters from URL search parameters. It extracts the page and limit parameters, validates and sanitizes them, and returns an object containing the page and limit numbers.

```typescript
generateMetaTags(baseUrl: string, pagination: PaginationResult): Array<{ property: string; content: string }>
```

Generates pagination meta tags for SEO purposes. It takes the base URL and pagination result as input, validates the base URL, and generates meta tags for the previous and next pages if they exist.

**Interfaces**

```typescript
export interface PaginationParams {
  page?: number
  limit?: number
  totalItems: number
}
```

Defines the structure for pagination parameters, including the current page number, number of items per page, and total number of items.

```typescript
export interface PaginationResult {
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
```

Defines the structure for the pagination result, including the current page number, total number of pages, number of items per page, total number of items, flags for the next and previous pages, next and previous page numbers, offset, and start and end indices of items on the current page.

**Example Usage**

```typescript
// Get the singleton instance
const pagination = PaginationService.getInstance()

const params = { page: 1, limit: 10, totalItems: 100 }
const result = pagination.calculate(params)

console.log(result)
```

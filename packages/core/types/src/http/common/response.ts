export type DeleteResponse<T> = {
  /**
   * The ID of the item that was deleted.
   */
  id: string

  /**
   * The type of the item that was deleted.
   */
  object: string

  /**
   * Whether the item was deleted successfully.
   */
  deleted: boolean

  /**
   * The parent resource of the item that was deleted, if applicable.
   */
  parent?: T
}

export interface PaginatedResponse {
  limit: number
  offset: number
  count: number
}

export type Paginated<T> = {
  canFetchMore: boolean;
  nextPage: number;
  totalItems: number;
  items: T[];
};

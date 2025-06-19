export interface BaseEntity {
  PK: string; // Partition Key
  SK: string; // Sort Key
  type: string; // Entity type for single table design
  createdAt: string;
  updatedAt: string;
}

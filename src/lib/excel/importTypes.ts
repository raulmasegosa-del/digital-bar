export type ExistingRecordAction =
  | "ignore"
  | "overwrite";

export type EmptyFieldAction =
  | "keep"
  | "clear";

export type ImportOptions = {
  existingCategory: ExistingRecordAction;
  existingProduct: ExistingRecordAction;
  emptyFields: EmptyFieldAction;
};
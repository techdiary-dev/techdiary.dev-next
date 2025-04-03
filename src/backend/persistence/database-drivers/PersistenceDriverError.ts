export class PersistenceDriverError extends Error {
  constructor(
    message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = "PersistenceDriverError";
  }
}

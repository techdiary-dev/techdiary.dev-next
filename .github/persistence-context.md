## Project Overview

This project is a custom-built mini-ORM utility for managing database operations in a Node.js/TypeScript application. It includes features like query building, pagination, joins, and CRUD operations.

### Key Directories and Files

- **`src/backend/persistence/`**: Contains the core persistence logic.

  - `persistence.repository.ts`: Implements the `PersistentRepository` class for database operations.
  - `persistence-contracts.ts`: Defines interfaces and types for persistence operations.
  - `persistence-utils.ts`: Utility functions for building SQL queries.
  - `persistence-where-operator.ts`: Helper functions for building `WHERE` clauses.
  - `database-drivers/pg.client.ts`: PostgreSQL database driver implementation.

- **`src/backend/persistence-repositories.ts`**: Exports repository instances for specific database tables.

### Key Features

1. **Dynamic Query Building**:

   - Supports `WHERE`, `ORDER BY`, `JOIN`, and pagination.
   - Utility functions like `buildWhereClause`, `buildOrderByClause`, and `buildJoinClause`.

2. **CRUD Operations**:

   - `findRows`, `findRowCount`, `createOne`, `createMany`, `updateOne`, `deleteRows`.

3. **Error Handling**:

   - Custom error classes like `PersistenceDriverError`.

4. **Database Driver**:
   - Uses PostgreSQL (`pg` package) for database interactions.

### Testing

- Tests are written using Jest.
- Mocking is used for the database driver (`IPersistentDriver`).
- Test cases cover all repository methods and utility functions.

### Common Queries

1. **How to test a specific method?**

   - Provide the method name and its file path. Example: `findRows` in `persistence.repository.ts`.

2. **How to add a new feature?**

   - Specify the feature and its purpose. Example: Add support for `GROUP BY` in queries.

3. **How to debug an issue?**

   - Provide the error message and the relevant file or method.

4. **How to write migrations?**
   - Specify the table and column changes. Example: Add a new column to the `users` table.

### Example Prompts

- "Can you check the `findRows` method in `persistence.repository.ts`?"
- "Can you write test cases for the `updateOne` method?"
- "How can I add a `GROUP BY` clause to the query builder?"
- "Can you help me debug this error: `Failed to initialize database connection`?"

### Notes

- Always use parameterized queries to prevent SQL injection.
- Follow TypeScript best practices for type safety.
- Use environment variables for database configuration.

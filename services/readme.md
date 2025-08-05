# Architecture Guidelines

This document describes the architecture, file system structure,
and naming conventions for the web application to ensure consistency and maintainability.

## 1. Layers

The architecture is divided into five logical layers. Each layer has a clearly defined responsibility.
Dependencies always point inwards (from UI towards Infrastructure).

| Name           | Description                                                |
| -------------- | ---------------------------------------------------------- |
| UI             | Renders the user interface (Pages & Components).           |
| Hooks          | Encapsulates client-side state and interaction logic.      |
| Endpoints      | Defines the public-facing API for clients (e.g., GraphQL). |
| Domain         | Contains the core business logic, models, and rules (Zod). |
| Infrastructure | Manages external concerns like the database.               |

## 2. File System

We use a Vertical Slicing architecture. The code is not grouped by technical layers
but by business features (Business Domains). It increases cohesion and simplifies maintainability.

Each feature lives in its own folder (e.g., `/services/text-documents/`).
Within this folder, it is further divided by Use Cases (Actions) (e.g., `/get-text-document/`).

- `/services/`
  - `text-documents/`
    - `text-document.model.ts`
    - `get-text-document/`
      - `get-text-document.service.ts`
      - `get-text-document.infrastructure.ts`
      - `get-text-document.resolver.ts`
      - `ui/`
        - `get-text-document.query.ts`
        - `use-get-text-document.ts`

## 3. Naming Conventions

Consistent naming is crucial for the readability and discoverability of code.

### Files

Files within a use-case folder follow the pattern `[action]`.`[layer]`.ts.

- get-text-document.service.ts
- get-text-document.infrastructure.ts
- get-text-document.resolver.ts

### React Hooks

Hooks are named according to the pattern use`[Action]`.ts.
- use-get-text-document.ts
- use-create-text-document.ts

### Domain Models

Zod schemas and their inferred types live in files following the pattern `[resource]`.model.ts.
- text-document.model.ts
- user.model.ts

### Guiding Principle for Type

`type` is preferred over `interface` to ensure a consistent and flexible definition of data structures.

## 4. Logging

A consistent logging strategy is essential for monitoring, debugging, and understanding the application's behavior.
My approach follows the architectural layers to provide a clear trace of every request.

### Log Message Conventions

Log messages must follow the consistent pattern "[Context]: [Action]" to ensure readability and easy filtering.

## 5. Error Handling

Error handling follows a clear, cross-layer pattern to ensure predictable and secure API responses.

1. **Domain Layer:** Throws specific, custom error classes (e.g., `TextDocumentNotFoundError`) to clearly name business errors.
2. **Endpoint Layer:** Catches these specific errors and uses a `createApiError` helper to translate them into standardized `GraphQLError` objects for the client.
3. **Global Errors:** Unexpected system errors are caught by a global handler, logged, and returned to the client as a generic `INTERNAL_SERVER_ERROR` to avoid leaking internal details.

## 5. Database Migrations

Since this project uses MongoDB (schema-less) with Prisma, we distinguish between schema definition changes and data migrations.

### Schema Changes

1.  Modify the `schema.prisma` file.
2.  Run `npx prisma generate` to update the Prisma Client.
3.  Run `npx prisma migrate dev --name <migration-name>` to create a history of the schema change in the `prisma/migrations` folder. This command does **not** alter the MongoDB data.

### Data Migrations

To apply schema changes to existing data in production without causing downtime, a two-phase deployment is required. The `migrate-mongo` library is used to manage and execute data migration scripts.

**Phase 1: Deploy Tolerant Code**
1.  **Adjust Zod Schema:** Make the validation schemas in the `.model.ts` files tolerant of both the old and new data structure (e.g., by using `.optional()`).
2.  **Deploy to Vercel:** Commit and deploy this tolerant version of the application.

**Phase 2: Migrate Data & Deploy Strict Code**
1.  **Create Migration Script:** Use `npm run migrate:create <migration-name>` to generate a new migration file in the `migrations/` directory. Fill it with the necessary data transformation logic.
2.  **Run Production Migration:** After the tolerant code is live, run the migration against the production database from your local machine. The workflow is streamlined by the Vercel CLI:
    ```bash
    # 1. (IMPORTANT) Create a backup of the production database.
    # 2. Pull production environment variables into a temporary file.
    vercel env pull .env.production --environment=production
    # 3. Run the migration.
    npm run migrate:prod
    # 4. (IMPORTANT) Delete the temporary environment file.
    rm .env.production
    ```
3.  **Revert to Strict Schema:** Change the Zod schemas back to be strict, enforcing the new data structure (e.g., using `z.discriminatedUnion`).
4.  **Final Deploy:** Commit and deploy this final, strict version of the application to Vercel.
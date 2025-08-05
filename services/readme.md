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

## 5. Database Migrations

1. Adapt code to be tolerant
2. Deploy tolerant code
3. Migrate database
4. Adapt code to be strict again
5. Deploy strict code

## 6. Error Handling

Error handling follows a clear, cross-layer pattern to ensure predictable and secure API responses.

1. **Domain Layer:** Throws specific, custom error classes (e.g., `TextDocumentNotFoundError`) to clearly name business errors.
2. **Endpoint Layer:** Catches these specific errors and uses a `createApiError` helper to translate them into standardized `GraphQLError` objects for the client.
3. **Global Errors:** Unexpected system errors are caught by a global handler, logged, and returned to the client as a generic `INTERNAL_SERVER_ERROR` to avoid leaking internal details.
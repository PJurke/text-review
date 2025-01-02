# Text Review

## Directories

- **app** Pages and APIs
- **app/api** Directory for Different APIs
- **app/api/graphql** GraphQL API
- **app/document** Text Highlighting Page
- **components** Reusable UI Components
- **services** End-to-End Service
- **services/[name]** Service Name
- **services/[name]/business-logic** Business Logic Scripts
- **services/[name]/client** Client-Related Scripts
- **services/[name]/graphql** GraphQL-Specific Scripts
- **services/shared** Cross-Service Scripts
- **types** Data Structures

## API Sequence
- GraphQL -> Service -> Database -> Service -> GraphQL

### GraphQL
- Is the GraphQL Resolver
- Receive data from client
- Call business logic (service)
- Get business logic response (including exceptions)
- Generate GraphQL response

### Service
- Is the business logic
- Receive data from GraphQL
- Validates the incoming data
- Maps the data to target types
- Establishes the database connection
- Checks for existing/correct data in database
- Does the respective database operations
- Return the database response
- Throws exceptions

## Logging
- **error** Critical errors, e.g. failed database connection, API errors
- **warn** Important warnings, e.g. old APIs usage, high resource usage
- **info** General information, e.g. successful API requests, user login
- **http** Incoming http requests, e.g. http method and status code
- **verbose** Detailed information, e.g. process steps
- **debug** Developer information, e.g. variable values, function steps
- **silly** Most detailed information, e.g. raw data
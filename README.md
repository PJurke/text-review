# Text Review

Text Review is a web application that allows users to analyze and highlight official texts. The aim is to promote a better understanding and detailed analysis of texts.

## Features

- Collection of texts from official sources
- Creation of text analyses
- Highlighting of text sections within an analysis
- GraphQL API

## Technologies

- **Frontend:** NextJS, React, TypeScript, Tailwind CSS
- **Backend:** NextJS, GraphQL by Apollo Server
- **Database:** MongoDB
- **Data Validation:** Zod
- **State Management:** Apollo Client, Zustand
- **Testing:** Jest, React Testing Library
- **Logging:** Winston

## Requirements

- NodeJS
- npm
- MongoDB

## Setup

1. **Clone Repository**
   ```bash
    git clone <repository-url>
    cd text-review
    ```

2. **Install Dependencies**
   ```bash
    npm install
    # oder
    yarn install
    # oder
    pnpm install
    ```

3. **Setup Environment Variables**
   
   Create an .env file based on the .env.example file

4. **Run Application**
    ```bash
    npm run dev
    ```

    The application should now be accessible at [http://localhost:3000](http://localhost:3000).

## Project Structure

- **app** Pages and APIs
- **app/api** Directory for different APIs
- **app/api/graphql** GraphQL API
- **app/analysis** Text Analysis Page
- **app/document** Text Document Page
- **app/why** Purpose of Text Review
- **components** Reusable UI Components
- **entities** Database Data Structures
- **lib** Auxiliary functions
- **seeds** Scripts to seed a Database
- **services** End-to-End Service
- **services/[name]** Service Name
- **services/[name]/business-logic** Business Logic Scripts
- **services/[name]/client** Client-Related Scripts
- **services/[name]/graphql** GraphQL-Specific Scripts
- **services/shared** Cross-Service Scripts
- **shared** Data Structure Mappers
- **types** TypeScript Data Structures

## Logging
- **error** Critical errors, e.g. failed database connection, API errors
- **warn** Important warnings, e.g. old APIs usage, high resource usage
- **info** General information, e.g. successful API requests, user login
- **http** Incoming http requests, e.g. http method and status code
- **verbose** Detailed information, e.g. process steps
- **debug** Developer information, e.g. variable values, function steps
- **silly** Most detailed information, e.g. raw data

## More
- [Services Overview](./services/readme.md)
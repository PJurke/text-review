/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateTextAnalysisResponse = {
  __typename?: 'CreateTextAnalysisResponse';
  id?: Maybe<Scalars['String']['output']>;
};

/**  A highlighted range within a paragraph.  */
export type Highlight = {
  __typename?: 'Highlight';
  end: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  start: Scalars['Int']['output'];
};

/**  A single paragraph of a text document.  */
export type Paragraph = {
  __typename?: 'Paragraph';
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

/**  A paragraph with the analysis of its text.  */
export type ParagraphAnalysis = {
  __typename?: 'ParagraphAnalysis';
  highlights: Array<Highlight>;
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  /**  Retrieve a text document by its ID.  */
  textDocument?: Maybe<TextDocument>;
  /**  Retrieve a list of text documents  */
  textDocuments: Array<Maybe<TextDocumentSummary>>;
};


export type QueryTextDocumentArgs = {
  id: Scalars['ID']['input'];
};

/**  Response returned after removing a highlight.  */
export type RemoveHighlightResponse = {
  __typename?: 'RemoveHighlightResponse';
  success: Scalars['Boolean']['output'];
};

/**  An analysis of an existing text document.  */
export type TextAnalysis = {
  __typename?: 'TextAnalysis';
  author?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  paragraphs: Array<ParagraphAnalysis>;
  title: Scalars['String']['output'];
};

/**  A text document containing paragraphs.  */
export type TextDocument = {
  __typename?: 'TextDocument';
  author?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  paragraphs: Array<Paragraph>;
  title: Scalars['String']['output'];
};

/**  A summary of a text document  */
export type TextDocumentSummary = {
  __typename?: 'TextDocumentSummary';
  author?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type TextDocumentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TextDocumentQuery = { __typename?: 'Query', textDocument?: { __typename?: 'TextDocument', id: string, title: string, author?: string | null, paragraphs: Array<{ __typename?: 'Paragraph', id: string, text: string }> } | null };

export type TextDocumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type TextDocumentsQuery = { __typename?: 'Query', textDocuments: Array<{ __typename?: 'TextDocumentSummary', id: string, title: string, author?: string | null } | null> };


export const TextDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TextDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"paragraphs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]}}]} as unknown as DocumentNode<TextDocumentQuery, TextDocumentQueryVariables>;
export const TextDocumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TextDocuments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textDocuments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"author"}}]}}]}}]} as unknown as DocumentNode<TextDocumentsQuery, TextDocumentsQueryVariables>;
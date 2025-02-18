# Services

## Communication

React Service Hook <-> GraphQL Resolver <-> Business Logic

## Services List

- **Add Highlight** adds a new highlight to an existing text analysis
- **Create Text Analysis** creates a new text based on a given text document
- **Get Text Analysis** retrieves an existing text analysis
- **Get Text Document** retrieves an existing text document
- **Remove Highlight** removes a specific highlight of a text analysis document

## Errors

### Add Highlight

**Errors**

- ValidationError
- TextAnalysisNotFoundError
- TextDocumentNotFoundError
- ParagraphNotFoundError
- DatabaseError

### Create Text Analysis

**Errors**
- ValidationError
- TextDocumentNotFoundError
- DatabaseError

### Get Text Analysis

**Errors**
- ValidationError
- TextAnalysisNotFoundError
- TextDocumentNotFoundError
- DatabaseError

### Get Text Document

**Errors**
- ValidationError
- TextDocumentNotFoundError
- DatabaseError

### Remove Highlight

**Errors**
- ValidationError
- TextAnalysisNotFoundError
- ParagraphNotFoundError
- HighlightNotFoundError
- DatabaseError

## Error Mapping

| TypeScript | GraphQL Code |
|------------|--------------|
| ValidationError | BAD_USER_INPUT |
| TextDocumentNotFoundError | TEXT_DOCUMENT_NOT_FOUND |
| TextAnalysisNotFoundError | BAD_USER_INPUT |
| ParagraphNotFoundError | PARAGRAPH_NOT_FOUND |
| HighlightNotFoundError | HIGHLIGHT_NOT_FOUND |
| DatabaseError | INTERNAL_SERVER_ERROR |
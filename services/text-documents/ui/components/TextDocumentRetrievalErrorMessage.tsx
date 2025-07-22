'use-client';

import UserMessageComponent from "@/components/UserMessage";

export default function TextDocumentRetrievalErrorMessage(): JSX.Element {
    
    return (
        <UserMessageComponent
            icon={{
                alt: 'Retrieval Error',
                url: '/document-retrieval-error.png'
            }}
            title='Text Document Retrieval Error'
            message='There has been an error retrieving the document. Please try again later.'
            action={{
                label: 'Reload this Page',
                url: window.location.href
            }}
        />
    );
    
}
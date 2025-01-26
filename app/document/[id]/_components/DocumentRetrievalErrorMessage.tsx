'use-client';

import UserMessageComponent from "@/components/UserMessage";

export default function DocumentRetrievalErrorMessage(): JSX.Element {
    
    return (
        <UserMessageComponent
            icon={{
                alt: 'Retrieval Error',
                url: '/document-retrieval-error.png'
            }}
            title='Document Retrieval Error'
            message='There has been an error retrieving the document. Please try again later.'
            action={{
                label: 'Reload this Page',
                url: window.location.href
            }}
        />
    );
    
}
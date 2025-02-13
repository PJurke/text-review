'use-client';

import UserMessageComponent from "@/components/UserMessage";

export default function TextAnalysisRetrievalErrorMessage(): JSX.Element {
    
    return (
        <UserMessageComponent
            icon={{
                alt: 'Retrieval Error',
                url: '/document-retrieval-error.png'
            }}
            title='Text Analysis Retrieval Error'
            message='There has been an error retrieving the analysis. Please try again later.'
            action={{
                label: 'Reload this Page',
                url: window.location.href
            }}
        />
    );
    
}
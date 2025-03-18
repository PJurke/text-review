import UserMessageComponent from "@/components/UserMessage";

export default function TextDocumentNotFoundMessage(): JSX.Element {

    return (
        <UserMessageComponent
            icon={{
                alt: 'Text Document not found',
                url: '/document-not-found.png'
            }}
            title='Text Document not found'
            message='A text document with the given ID could not be found.'
            action={{
                label: 'Search for Documents',
                url: '/document'
            }}
        />
    );
    
}
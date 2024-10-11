import UserMessageComponent from "@/app/lib/common/UserMessage";

export default function DocumentNotFoundMessage() {

    return <UserMessageComponent
        icon={{
            alt: 'Document not found',
            url: '/document-not-found.png'
        }}
        title='Document not found'
        message='A document with the given ID could not be found.'
        action={{
            label: 'Search for Documents',
            url: 'https://www.google.de'
        }}
    />
    
}
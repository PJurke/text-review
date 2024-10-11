import UserMessageComponent from "@/app/lib/common/UserMessage";

export default function DocumentNotFoundMessage() {

    return <UserMessageComponent
        icon={{
            alt: 'Search Failed',
            url: '/search-failed.png'
        }}
        title='Document not found'
        message='A document with the given ID could not be found.'
        action={{
            label: 'Search for Documents',
            url: 'https://www.google.de'
        }}
    />
    
}
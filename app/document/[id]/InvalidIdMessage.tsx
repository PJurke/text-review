import UserMessageComponent from "@/app/lib/common/UserMessage";

export default function InvalidIdMessage() {
    
    return <UserMessageComponent
        icon={{
            alt: 'Search Failed',
            url: '/search-failed.png'
        }}
        title='Document ID invalid'
        message='Each document is identified by a unique id. The given document id is invalid.'
        action={{
            label: 'Search for Documents',
            url: 'https://www.google.de'
        }}
    />
    
}
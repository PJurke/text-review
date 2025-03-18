import UserMessageComponent from "@/components/UserMessage";

export default function InvalidIdMessage(): JSX.Element {
    
    return (
        <UserMessageComponent
            icon={{
                alt: 'ID Invalid',
                url: '/id-invalid.png'
            }}
            title='Text Document ID Invalid'
            message='Each document is identified by a unique id. The given document id is invalid.'
            action={{
                label: 'Search for Documents',
                url: '/'
            }}
        />
    );
    
}
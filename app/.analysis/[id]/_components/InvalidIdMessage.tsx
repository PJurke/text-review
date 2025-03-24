import UserMessageComponent from "@/components/UserMessage";

export default function InvalidIdMessage(): JSX.Element {
    
    return (
        <UserMessageComponent
            icon={{
                alt: 'ID Invalid',
                url: '/id-invalid.png'
            }}
            title='Text Analysis ID invalid'
            message='Each analysis is identified by a unique id. The given analyse id is invalid.'
            action={{
                label: 'Search for Analyses',
                url: '/'
            }}
        />
    );
    
}
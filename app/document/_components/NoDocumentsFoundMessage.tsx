import UserMessageComponent from "@/components/UserMessage";

export default function NoDocumentsFoundMessage(): JSX.Element {
    return (
        <UserMessageComponent
            icon={{
                alt: 'No Documents Found',
                url: '/document-not-found.png'
            }}
            title='No Documents Found'
            message='Currently, there are no documents available. Please check back later.'
            action={{
                label: 'Go to Homepage',
                url: '/'
            }}
        />
    );
}
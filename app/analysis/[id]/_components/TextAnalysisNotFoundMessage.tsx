import UserMessageComponent from "@/components/UserMessage";

export default function TextAnalysisNotFoundMessage(): JSX.Element {

    return (
        <UserMessageComponent
            icon={{
                alt: 'Text Analysis not found',
                url: '/document-not-found.png'
            }}
            title='Text Analysis not found'
            message='A text analysis with the given ID could not be found.'
            action={{
                label: 'Search for Analyses',
                url: '/'
            }}
        />
    );
    
}
import UserMessageComponent from "@/components/UserMessage";

export default function InternalErrorMessage(): JSX.Element {
    
    return (
        <UserMessageComponent
            icon={{
                alt: 'Internal Error',
                url: '/id-invalid.png'
            }}
            title='An Internal Error Occurred'
            message='An unexpected error occurred. The error was forwarded so the team can investigate. Please try again later.'
            action={{
                label: 'Go to the Homepage',
                url: '/'
            }}
        />
    );
    
}
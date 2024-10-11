import Image from "next/image"
import Link from "next/link"

interface MessageImage {
    alt: string
    url: string
}

interface MessageAction {
    label: string
    url: string
}

interface UserMessage {
    icon: MessageImage
    title: string
    message: string
    action?: MessageAction
}

export default function UserMessageComponent({ icon, title, message, action }: UserMessage) {
    return (
        <section className="flex flex-col justify-center h-dvh items-center m-auto text-center">
            <header>
                <Image alt={ icon.alt } className="m-auto" height={ 150 } src={ icon.url } width={ 150 } />
            </header>
            <main className="mt-3">
                <h1 className="text-2xl">{ title }</h1>
                <p>{ message }</p>
            </main>
            <footer className="mt-3">
                {
                    action && (
                        <Link className="text-gray-500 text-sm" href={ action.url }>{ action.label }</Link>
                    )
                }
            </footer>
        </section>
    )
}
import Image from "next/image"
import Link from "next/link"

interface UserMessage {
    icon: {
        alt: string
        url: string
    },
    title: string
    message: string
    action?: {
        label: string
        url: string
    }
}

export default function UserMessageComponent({ icon, title, message, action }: UserMessage) {
    return (
        <section className="flex flex-col justify-center h-dvh items-center m-auto p-1 text-center">
            <header>
                <Image alt={ icon.alt } className="m-auto" height={ 150 } src={ icon.url } width={ 150 } />
            </header>
            <main className="mt-3">
                <h1 className="text-2xl">{ title }</h1>
                <p className="mt-1 text-gray-500">{ message }</p>
            </main>
            <footer className="mt-3">
                {
                    action && (
                        <Link className="text-blue-500 text-sm" href={ action.url }>{ action.label }</Link>
                    )
                }
            </footer>
        </section>
    );
}
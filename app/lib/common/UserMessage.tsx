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

export default function UserMessageComponent(details: UserMessage) {
    return (
        <div>
            <Image alt={details.icon.alt} src={details.icon.url} />
            <div>{ details.title }</div>
            <div>{ details.message }</div>
            {
                details.action && (
                    <Link href={details.action.url}>{ details.action.label }</Link>
                )
            }
        </div>
    )
}
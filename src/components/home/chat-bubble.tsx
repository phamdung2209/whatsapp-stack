import Image from 'next/image'
import { MessageSeenSvg } from '~/lib/svgs'
import { IMessage, useConversationStore } from '~/store/chat-store'
import ChatBubbleAvatar from './chat-bubble-avatar'
import DateIndicator from './date-indicator'

type TChatBubble = {
    me: any
    message: IMessage
    previousMessage?: IMessage
}

const ChatBubble = ({ me, message, previousMessage }: TChatBubble) => {
    const date = new Date(message._creationTime)
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    const time = `${hour}:${minute}`

    const { selectedConversation } = useConversationStore()
    const isMember: boolean = selectedConversation?.participants.includes(message.sender?._id) || false
    const isGroup: boolean | undefined = selectedConversation?.isGroup
    const fromMe: boolean = message.sender?._id === me._id

    const bgClass = fromMe
        ? 'bg-green-chat'
        : !message.sender?.name
          ? 'bg-white dark:bg-gray-primary'
          : 'bg-blue-500 text-white'

    const renderMessageContent = () => {
        switch (message.messageType) {
            case 'text':
                return <TextMessage message={message} />
            case 'image':
            // return <ImageMessage message={message} handleClick={() => setOpen(true)} />
            case 'video':
            // return <VideoMessage message={message} />
            default:
                return null
        }
    }

    if (!fromMe) {
        return (
            <>
                <DateIndicator message={message} previousMessage={previousMessage} />
                <div className="flex gap-1 w-2/3">
                    <ChatBubbleAvatar isGroup={isGroup} isMember={isMember} message={message} />
                    <div className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}>
                        <SelfMessageIndicator />
                        <TextMessage message={message} />
                        <MessageTime time={time} fromMe={fromMe} />
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <DateIndicator message={message} previousMessage={previousMessage} />
            <div className="flex gap-1 w-2/3 ml-auto">
                <div
                    className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ml-auto ${bgClass}`}
                >
                    <SelfMessageIndicator />
                    <TextMessage message={message} />
                    <MessageTime time={time} fromMe={fromMe} />
                </div>
            </div>
        </>
    )
}
export default ChatBubble

const OtherMessageIndicator = () => (
    <div className="absolute bg-white dark:bg-gray-primary top-0 -left-[4px] w-3 h-3 rounded-bl-full" />
)

const TextMessage = ({ message }: { message: IMessage }) => {
    const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content) // Check if the content is a URL

    return (
        <div>
            {isLink ? (
                <a
                    href={message.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mr-2 text-sm font-light text-blue-400 underline`}
                >
                    {message.content}
                </a>
            ) : (
                <p className={`mr-2 text-sm font-light`}>{message.content}</p>
            )}
        </div>
    )
}

const ImageMessage = ({ message, handleClick }: { message: IMessage; handleClick: () => void }) => {
    return (
        <div className="w-[250px] h-[250px] m-2 relative">
            <Image
                src={message.content}
                fill
                className="cursor-pointer object-cover rounded"
                alt="image"
                onClick={handleClick}
            />
        </div>
    )
}

const VideoMessage = ({ message }: { message: IMessage }) => {
    // return <ReactPlayer url={message.content} width='250px' height='250px' controls={true} light={true} />;
}

const MessageTime = ({ time, fromMe }: { time: string; fromMe: boolean }) => {
    return (
        <p className="text-[10px] mt-2 self-end flex gap-1 items-center">
            {time} {fromMe && <MessageSeenSvg />}
        </p>
    )
}

const SelfMessageIndicator = () => (
    <div className="absolute bg-green-chat top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden" />
)

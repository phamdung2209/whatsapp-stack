import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Video, X } from 'lucide-react'
import MessageContainer from './message-container'
import MessageInput from './message-input'
import ChatPlaceholder from './chat-placeholder'
import GroupMembersDialog from './group-members-dialog'

const RightPanel = () => {
    const selectedConversation = true
    if (!selectedConversation) return <ChatPlaceholder />

    const conversationName = 'John Doe'
    const isGroup = true

    return (
        <div className="w-3/4 flex flex-col">
            <div className="w-full sticky top-0 z-50">
                {/* Header */}
                <div className="flex justify-between bg-gray-primary p-3">
                    <div className="flex gap-3 items-center">
                        <Avatar>
                            <AvatarImage src={'/placeholder.png'} className="object-cover" />
                            <AvatarFallback>
                                <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p>{conversationName}</p>
                            {isGroup && <GroupMembersDialog />}
                        </div>
                    </div>

                    <div className="flex items-center gap-7 mr-5">
                        <a href="/video-call" target="_blank">
                            <Video size={23} />
                        </a>
                        <X size={16} className="cursor-pointer" />
                    </div>
                </div>
            </div>
            {/* CHAT MESSAGES */}
            <MessageContainer />
            <video
                className="w-72"
                src={'https://intent-warthog-793.convex.cloud/api/storage/e62e64ef-7dae-4ff8-a782-04fd8500e183'}
                controls
            />

            {/* INPUT */}
            <MessageInput />
        </div>
    )
}

export default RightPanel

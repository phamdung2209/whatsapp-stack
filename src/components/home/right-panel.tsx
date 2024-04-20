import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Video, X } from 'lucide-react'
import MessageContainer from './message-container'
import MessageInput from './message-input'
import ChatPlaceholder from './chat-placeholder'
import GroupMembersDialog from './group-members-dialog'
import { useConversationStore } from '~/store/chat-store'

const RightPanel = () => {
    const { selectedConversation, setSelectedConversation } = useConversationStore()
    if (!selectedConversation) return <ChatPlaceholder />

    const conversationName = selectedConversation.groupName ?? selectedConversation.name
    const isGroup = selectedConversation.isGroup

    return (
        <div className="w-3/4 flex flex-col">
            <div className="w-full sticky top-0 z-50">
                {/* Header */}
                <div className="flex justify-between bg-gray-primary p-3">
                    <div className="flex gap-3 items-center">
                        <Avatar>
                            <AvatarImage
                                src={
                                    isGroup
                                        ? selectedConversation.groupImage ?? '/placeholder.png'
                                        : selectedConversation.image ?? '/placeholder.png'
                                }
                                className="object-cover"
                            />
                            <AvatarFallback>
                                <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p>{conversationName}</p>
                            {isGroup && <GroupMembersDialog selectedConversation={selectedConversation} />}
                        </div>
                    </div>

                    <div className="flex items-center gap-7 mr-5">
                        <a href="/video-call" target="_blank">
                            <Video size={23} />
                        </a>
                        <X size={16} className="cursor-pointer" onClick={() => setSelectedConversation(null)} />
                    </div>
                </div>
            </div>
            {/* CHAT MESSAGES */}
            <MessageContainer />

            {/* INPUT */}
            <MessageInput />
        </div>
    )
}

export default RightPanel

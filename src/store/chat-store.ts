import { Id } from '../../convex/_generated/dataModel'
import { create } from 'zustand'

export type Conversation = {
    _id: Id<'conversations'>
    image?: string
    participants: Id<'users'>[]
    isGroup: boolean
    name?: string
    groupImage?: string
    groupName?: string
    admin?: Id<'users'>
    isOnline?: boolean
    lastMessage?: {
        _id: Id<'messages'>
        conversation: Id<'conversations'>
        content: string
        sender: Id<'users'>
    } | null
}

type TConversationStore = {
    selectedConversation: Conversation | null
    setSelectedConversation: (conversation: Conversation | null) => void
}

export const useConversationStore = create<TConversationStore>((set) => ({
    selectedConversation: null,
    setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
}))

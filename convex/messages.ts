import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const sendTextMessage = mutation({
    args: {
        sender: v.string(),
        content: v.string(),
        conversation: v.id('conversations'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthenticated')

        const user = await ctx.db
            .query('users')
            .withIndex('by_tokenIdentifier', (q) =>
                q.eq('tokenIdentifier', identity.tokenIdentifier.replace('https://', '')),
            )
            .unique()
        if (!user) throw new Error('User not found')

        const conversation = await ctx.db
            .query('conversations')
            .filter((q) => q.eq(q.field('_id'), args.conversation))
            .first()
        if (!conversation) throw new Error('Conversation not found')

        if (!conversation.participants.includes(user._id))
            throw new Error('You are not a participant of this conversation')

        await ctx.db.insert('messages', {
            sender: args.sender,
            content: args.content,
            conversation: args.conversation,
            messageType: 'text',
        })
    },
})

// unoptimized
// export const getMessages = query({
//     args: {
//         conversationId: v.id('conversations'),
//     },
//     handler: async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity()
//         if (!identity) throw new Error('Unauthenticated')

//         const messages = await ctx.db
//             .query('messages')
//             .withIndex('by_conversation', (q) => q.eq('conversation', args.conversationId))
//             .collect()

//         const messagesWithSender = await Promise.all(
//             messages.map(async (message) => {
//                 const sender = await ctx.db
//                     .query('users')
//                     .filter((q) => q.eq(q.field('_id'), message.sender))
//                     .first()

//                 return {
//                     ...message,
//                     sender,
//                 }
//             }),
//         )

//         return messagesWithSender
//     },
// })

// optimized
export const getMessages = query({
    args: {
        conversationId: v.id('conversations'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthenticated')

        const messages = await ctx.db
            .query('messages')
            .withIndex('by_conversation', (q) => q.eq('conversation', args.conversationId))
            .collect()

        const userProfileCache = new Map()
        const messagesWithSender = await Promise.all(
            messages.map(async (message) => {
                let sender

                if (userProfileCache.has(message.sender)) {
                    sender = userProfileCache.get(message.sender)
                } else {
                    sender = await ctx.db
                        .query('users')
                        .filter((q) => q.eq(q.field('_id'), message.sender))
                        .first()
                    userProfileCache.set(message.sender, sender)
                }

                return {
                    ...message,
                    sender,
                }
            }),
        )

        return messagesWithSender
    },
})

import { v } from 'convex/values'
import { mutation } from './_generated/server'

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

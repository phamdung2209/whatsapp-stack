import { ConvexError, v } from 'convex/values'
import { internalMutation, query } from './_generated/server'

export const createUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        email: v.string(),
        image: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert('users', {
            tokenIdentifier: args.tokenIdentifier,
            email: args.email,
            image: args.image,
            name: args.name,
            isOnline: true,
        })
    },
})

export const setUserOffline = internalMutation({
    args: {
        tokenIdentifier: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', args.tokenIdentifier))
            .unique()

        if (!user) {
            throw new ConvexError('User not found')
        }

        await ctx.db.patch(user._id, {
            isOnline: false,
        })
    },
})

export const setUserOnline = internalMutation({
    args: {
        tokenIdentifier: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', args.tokenIdentifier))
            .unique()

        if (!user) {
            throw new ConvexError('User not found')
        }

        await ctx.db.patch(user._id, {
            isOnline: true,
        })
    },
})

export const updateUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', args.tokenIdentifier))
            .unique()

        if (!user) {
            throw new ConvexError('User not found')
        }

        await ctx.db.patch(user._id, {
            image: args.image,
        })
    },
})

export const getUsers = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new ConvexError('User not found')
        }
        const users = await ctx.db.query('users').collect()

        return users.filter((user) => user.tokenIdentifier !== identity.tokenIdentifier.replace('https://', '')) // Remove self
    },
})

export const getMe = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new ConvexError('Unauthorized')
        }

        const user = await ctx.db
            .query('users')
            .withIndex('by_tokenIdentifier', (q) =>
                q.eq('tokenIdentifier', identity.tokenIdentifier.replace('https://', '')),
            )
            .unique()

        if (!user) {
            throw new ConvexError('User not found')
        }

        return user
    },
})

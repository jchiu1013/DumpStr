const { AuthenticationError } = require("apollo-server")
const Pin = require('./models/Pin')

// const user = {
//     _id: "1",
//     name: "Ryan",
//     email: "ryansherring@gmail.com",
//     picture: "https://cloudinary.com/asdf"
// }

const authenticated = next => (root, args, ctx, info) => {
    if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in')
    }
    return next(root, args, ctx, info)
    console.log(ctx)
}

module.exports = {
    Query: {
        me: authenticated((root, args, ctx) => ctx.currentUser)
    },
    Mutation: {
        createPin: authenticated(async(root, args, ctx) => {
            const newPin = await new Pin({
                ...args.input,
                author: ctx.currentUser._id
            }).save()
            const pinAdded = await Pin.populate(newPin, 'author')
            return pinAdded
        })
    }
}


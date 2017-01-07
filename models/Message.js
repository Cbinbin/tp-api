const mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Info = require('./Info')
    , Video = require('./Video')
    , Comment = require('./Comment')

const messageSchema = new Schema({
	ownerId: {
		type: Schema.Types.ObjectId,
		ref: 'Info'
	},
	anotherId: {
		type: Schema.Types.ObjectId,
		ref: 'Info'
	},
	videoId: {
		type: Schema.Types.ObjectId,
		ref: 'Video'
	},
	commentId: {
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	},
	kinds: {
		type: Number,
	},
	createTime: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Message', messageSchema)
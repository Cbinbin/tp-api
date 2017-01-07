const mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Info = require('./Info')
    , Video = require('./Video')

const historySchema = new Schema({
	ownerId: {
		type: Schema.Types.ObjectId,
		ref: 'Info'
	},
	videoId: {
		type: Schema.Types.ObjectId,
		ref: 'Video'
	},
	create_time: {
		type: Date,
		default: Date.now
	},
	view_time: {
		type: Date,
		default: Date.now
	}
},{
	timestamps: {
		createdAt: 'create_time',
		updatedAt: 'view_time'
	}
})

module.exports = mongoose.model('History', historySchema)
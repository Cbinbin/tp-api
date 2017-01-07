const mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , HeadPic = require('./HeadPic')
    , Info = require('./Info')
    , VideoUrl = require('./VideoUrl')
    , Cover = require('./Cover')
    , Comment = require('./Comment')


const videoSchema = new Schema({
	poster: {
		type: Schema.Types.ObjectId,
		ref: 'Info'
	},
	title: {               //标题
		type: String,
		required: true
	},
	video_url: {
		type: Schema.Types.ObjectId,
		ref: 'VideoUrl'
	},
	cover: {
		type: Schema.Types.ObjectId,
		ref: 'Cover'
	},
	channel: {
		type: String,
		enum: ['hot', 'dobe', 'curious', 'entertainment', 'interCelebrity', 'society',
				'goddess', 'movies', 'music', 'comic', 'pet', 'sports']
	},
	view_number: {
		type: Number,
	},
	like_number: {
		type: Number,
	},
	comment_number: {
		type: Number,
	},
	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}],
	create_time: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Video', videoSchema)
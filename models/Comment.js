const mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Info = require('./Info')
    , Video = require('./Video')

const commentSchema = new Schema({
	video_id: {
		type: Schema.Types.ObjectId,
		ref: 'Video'
	},
	chatTF: {
		type: Boolean,
	},
	commenter: {
		type: Schema.Types.ObjectId,
		ref: 'Info'
	},
	remark: {            //评论
		type: String,
		required: true
	},
	answer: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}],
	laud: [{            //赞的人
		type: Schema.Types.ObjectId,
		ref: 'Info'
	}],
	laud_number: {
		type: Number,
	},
	remark_time: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Comment', commentSchema)
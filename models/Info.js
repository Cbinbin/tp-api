const mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Thn = require('./Thn')
    , Video = require('./Video')
    , History = require('./History')
    , Message = require('./Message')

const infoSchema = new Schema({
	openid: {
		type: String,
	},
	nickname: {
		type: String,
	},
	sex: {
		type: String,
		enum: ['1', '2', '0']    //1:男, 2:女, 0:未知
	},
	signature: {
		type: String,
	},
	thumbnail: {
		type: Schema.Types.ObjectId,
		ref: 'Thn'
	},
	head_pic: {
		type: String,
	},
	pub_videos: [{
		type: Schema.Types.ObjectId,
		ref: 'Video'
	}],
	follows: [{
		type: Schema.Types.ObjectId,
		ref: 'Info'
	}],
	fans: [{
		type: Schema.Types.ObjectId,
		ref: 'Info'
	}],
	favorites: [{
		type: Schema.Types.ObjectId,
		ref: 'Video'
	}],
	history: [{
		type: Schema.Types.ObjectId,
		ref: 'History'
	}],
	info_time: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Info', infoSchema)
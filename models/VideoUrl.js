const mongoose = require('mongoose')
    , Schema = mongoose.Schema

const videourlSchema = new Schema({
	vid_url: {
		type: String
	}
})

module.exports = mongoose.model('VideoUrl', videourlSchema)
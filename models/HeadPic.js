const mongoose = require('mongoose')
    , Schema = mongoose.Schema

const headpicSchema = new Schema({
	headPic_url: {
		type: String
	}
})

module.exports = mongoose.model('HeadPic', headpicSchema)
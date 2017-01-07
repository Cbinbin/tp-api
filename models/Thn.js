const mongoose = require('mongoose')
    , Schema = mongoose.Schema

const thnSchema = new Schema({
	thnPic_url: {
		type: String
	}
})

module.exports = mongoose.model('Thn', thnSchema)
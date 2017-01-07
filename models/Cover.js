const mongoose = require('mongoose')
    , Schema = mongoose.Schema

const coverSchema = new Schema({
	cover_url: {
		type: String
	}
})

module.exports = mongoose.model('Cover', coverSchema)
const mongoose = require('mongoose')
    , Schema = mongoose.Schema

const loginSchema = new Schema({
	phone: {
		type: Number,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model('Login', loginSchema)
const router = require('express').Router()
    , heroku = require('../hostUrl')

router.get('/', (req, res)=> {
	res.json({
		'home': heroku.HOST,
		'reg': heroku.HOST + 'reg',
		'login': heroku.HOST + 'login',
		'session': heroku.HOST + 'session',
		'info': heroku.HOST + 'info',
		'video': heroku.HOST + 'video'
	})
})

module.exports = router
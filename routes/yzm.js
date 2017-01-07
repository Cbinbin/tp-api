const router = require('express').Router()
    , request = require('superagent')

router.get('/', (req, res)=> {
	var yzm = ''
	for(var i = 0; i < 6; i++) {
		yzm = yzm + Math.floor(Math.random()*10)
	}
	
	res.send(yzm)
})

module.exports = router
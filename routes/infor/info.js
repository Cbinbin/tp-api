const router = require('express').Router()
    , Info = require('../../models/Info')

router.get('/', (req, res)=> {
	Info.findOne({openid: req.opid})
	.exec((err, info)=> {
		if(err) return res.send(err)
		res.send(info)
	})
})

module.exports = router
const router = require('express').Router()
    , Info = require('../../models/Info')

router.get('/', (req, res)=> {
	Info.find({}, {__v:0, history:0, favorites:0})
	.exec((err, infos)=> {
		if(err) return res.send(err)
		res.send(infos)
	})
})

router.get('/:ifid', (req, res)=> {
	Info.findOne({_id: req.params.ifid}, {__v:0})
	.exec((err, info)=> {
		if(err) return res.send(err)
		res.send(info)
	})
})

module.exports = router
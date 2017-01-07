const router = require('express').Router()
	, Info = require('../models/Info')
	, Video = require('../models/Video')
	, pinyin = require('pinyin')

router.get('/info', (req, res)=> {
	const q = req.query.q
	    , re = new RegExp(q,'ig')
	Info.find()
	.where('nickname').regex(re)
	.exec((err, infos)=> {
		if(err) return res.send(err)
		res.send(infos)
	})
})

router.get('/video', (req, res)=> {
	const q = req.query.q
	    , re = new RegExp(q,'ig')
	Video.find()
	.where('title').regex(re)
	.exec((err, videos)=> {
		if(err) return res.send(err)
		res.send(videos)
	})
})

// var haha = pinyin('d斌f', {
// 	heteronym: true,
// 	style: pinyin.STYLE_NORMAL
// })

module.exports = router
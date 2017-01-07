const router = require('express').Router()
    , multer = require('multer')
    , fs = require('fs')
    , Info = require('../../models/Info')
    , HeadPic = require('../../models/HeadPic')
    , heroku = require('../../hostUrl')

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/head_imgs')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname )
  }
})
var upload = multer({ storage: storage }).single('headimg')


router.post('/', (req, res)=> {
	upload(req, res, (err) => {
		if(err) return res.send(err)
		const head = new HeadPic({
			_id: req.uid,
			headPic_url: heroku.HOST + req.file.path,
		})
		head.save((err)=> {
			if(err) return res.send(err)
			Info.findOneAndUpdate(
				{openid: req.opid},
				{$set: {head_pic: head.headPic_url}},
				{new: true},
				(err,info)=> {
					if(err) return res.send(err)
					res.send(info)
				}
			)
		})
	})
})

router.post('/r', (req, res)=> {
	upload(req, res, (err) => {
		if(err) return res.send(err)
		Info.findOne({openid: req.opid})
		.exec((err, info)=> {
			if(err) return res.send(err)
			fs.unlink(info.head_pic.substring(21), (err) => {
				if(err) return console.log(err)
				console.log('image deleted success')
			})
			info.head_pic = heroku.HOST + req.file.path
			info.save((err)=> {
				if(err) return res.send(err)
				res.send(info)
			})
		})
		HeadPic.findOneAndUpdate(
			{_id: req.uid},
			{$set: {headPic_url: heroku.HOST + req.file.path}},
			{new: true},    //, upsert: true
			(err, headimg)=> {
				if(err) return console.log(err)
			}
		)
	})
})

module.exports = router
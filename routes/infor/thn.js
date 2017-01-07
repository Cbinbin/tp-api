const router = require('express').Router()
    , multer = require('multer')
    , fs = require('fs')
    , Info = require('../../models/Info')
    , Thn = require('../../models/Thn')
    , heroku = require('../../hostUrl')

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/thn_imgs')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname )
  }
})
var upload = multer({ storage: storage }).single('thnimg')

router.post('/', (req, res)=> {
	upload(req, res, (err) => {
		if(err) return res.send(err)
		const thn = new Thn({
			thnPic_url: heroku.HOST + req.file.path,
		})
		thn.save((err)=> {
			if(err) return res.send(err)
			Info.findOneAndUpdate(
				{openid: req.opid},
				{$set: {thumbnail: thn._id}},
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
		.populate('thumbnail', 'thnPic_url')
		.exec((err, info)=> {
			if(err) return res.send(err)
			fs.unlink(info.thumbnail.thnPic_url.substring(21), (err) => {
				if(err) return console.log(err)
				console.log('image deleted success')
			})
			Thn.findOneAndUpdate(
				{_id: info.thumbnail},
				{$set: {thnPic_url: heroku.HOST + req.file.path}},
				{new: true},
				(err, thnimg)=> {
					if(err) return console.log(err)
					res.send(thnimg)
				}
			)
		})
	})
})

module.exports = router
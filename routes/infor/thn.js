const router = require('express').Router()
    , multer = require('multer')
    , qiniu = require('qiniu')
    , Info = require('../../models/Info')
    , Thn = require('../../models/Thn')
    , heroku = require('../../hostUrl')

var storage = multer.diskStorage({})
  , upload = multer({ storage: storage }).single('thnimg')

function rmkey(bucket, key) {
	var client = new qiniu.rs.Client()
	client.remove(bucket, key, (err, ret)=> {
		if (!err) {
			console.log(`${key} deleted success`)
		} 
		else {
			console.log(err)
		}
	})
}

router.post('/', (req, res)=> {
	qiniu.conf.ACCESS_KEY = process.env.QN_ACCESS
	qiniu.conf.SECRET_KEY = process.env.QN_SECRET
	var bucket = 'tp-thnimg'
	  , key = 'thn' + Date.now() + '.jpg'
	function uptoken(bucket, key) {
		var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key)
		return putPolicy.token()
	}
	qntoken = uptoken(bucket, key)
	function uploadFile(uptoken, key, localFile) {
		var extra = new qiniu.io.PutExtra()
		qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
			if(!err) {
				const thn = new Thn({
					thnPic_url: heroku.QN_T + ret.key,
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
			} else {
				res.send(err)
			}
		})
	}
	upload(req, res, (err) => {
		if(err) return res.send(err)
		uploadFile(qntoken, key, req.file.path)
	})
})

router.post('/r', (req, res)=> {
	qiniu.conf.ACCESS_KEY = process.env.QN_ACCESS
	qiniu.conf.SECRET_KEY = process.env.QN_SECRET
	var bucket = 'tp-thnimg'
	  , key = 'thn' + Date.now() + '.jpg'
	  , key_thn
	function uptoken(bucket, key) {
		var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key)
		return putPolicy.token()
	}
	qntoken = uptoken(bucket, key)
	function uploadFile(uptoken, key, localFile) {
		var extra = new qiniu.io.PutExtra()
		qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
			if(!err) {
				Info.findOne({openid: req.opid})
				.populate('thumbnail', 'thnPic_url')
				.exec((err, info)=> {
					if(err) return res.send(err)
					if(info.thumbnail.thnPic_url) {
						key_thn = info.thumbnail.thnPic_url.substring(33)
						rmkey(bucket, key_thn)
					}
					Thn.findOneAndUpdate(
						{_id: info.thumbnail._id},
						{$set: {thnPic_url: heroku.QN_T + ret.key}},
						{new: true},
						(err, thnimg)=> {
							if(err) return console.log(err)
							res.send(thnimg)
						}
					)
				})
			} else {
				res.send(err)
			}
		})
	}
	upload(req, res, (err) => {
		if(err) return res.send(err)
		uploadFile(qntoken, key, req.file.path)
	})
})

module.exports = router
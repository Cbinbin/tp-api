const router = require('express').Router()
    , multer = require('multer')
    , qiniu = require('qiniu')
    , Info = require('../../models/Info')
    , HeadPic = require('../../models/HeadPic')
    , heroku = require('../../hostUrl')

var storage = multer.diskStorage({})
  , upload = multer({ storage: storage }).single('headimg')

router.post('/', (req, res)=> {
	qiniu.conf.ACCESS_KEY = process.env.QN_ACCESS
	qiniu.conf.SECRET_KEY = process.env.QN_SECRET
	var bucket = 'tp-headimg'
	  , key = 'h' + Date.now() + '.jpg'
	function uptoken(bucket, key) {
		var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key)
		return putPolicy.token()
	}
	qntoken = uptoken(bucket, key)
	function uploadFile(uptoken, key, localFile) {
		var extra = new qiniu.io.PutExtra()
		qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
			if(!err) {
				const head = new HeadPic({
					_id: req.uid,
					headPic_url: heroku.QN_H + ret.key,
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

router.post('/r', (req, res)=> {
	qiniu.conf.ACCESS_KEY = process.env.QN_ACCESS
	qiniu.conf.SECRET_KEY = process.env.QN_SECRET
	var bucket = 'tp-headimg'
	  , key = 'h' + Date.now() + '.jpg'
	  , key_head
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
				.exec((err, info)=> {
					if(err) return res.send(err)
					if(info.head_pic) {
						key_head = info.head_pic.substring(33)
						rmkey(bucket, key_head)
					}
					info.head_pic = heroku.QN_H + ret.key
					info.save((err)=> {
						if(err) return res.send(err)
						res.send(info)
					})
				})
				HeadPic.findOneAndUpdate(
					{_id: req.uid},
					{$set: {headPic_url: heroku.QN_H + ret.key}},
					{new: true},
					(err, headimg)=> {
						if(err) return console.log(err)
					}
				)
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
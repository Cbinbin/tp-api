const router = require('express').Router()
    , request = require('superagent')
    , multer = require('multer')
    , qiniu = require('qiniu')
    , VideoUrl = require('../../models/VideoUrl')
    , Video = require('../../models/Video')
    , Cover = require('../../models/Cover')
    , heroku = require('../../hostUrl')

function createVideo(cname, vname, vid, res) {
	var duration
	  , ff
	  , ss
	const scs = new Cover({
		cover_url: heroku.QN_C + cname,
	})
	const vidurl = new VideoUrl({
		vid_url: heroku.QN_V + vname,
	})
	scs.save((err)=> {
		if(err) return res.send(err)
		vidurl.save((err)=> {
			if(err) return res.send(err)
			request.get(`${vidurl.vid_url}?avinfo`)
			.end((err, result)=> {
				if(err) return console.log(err)
				duration = JSON.parse(result.text).format.duration
				ff = parseInt(Number(duration)/60) < 10 ? '0'+parseInt(Number(duration)/60) : parseInt(Number(duration)/60)
				ss = parseInt(Number(duration)%60) < 10 ? '0'+parseInt(Number(duration)%60) : parseInt(Number(duration)%60)
				Video.findOneAndUpdate(
					{_id: vid},
					{$set: {cover: scs._id,
						video_url: vidurl._id,
						length: `${ff}:${ss}`}},
					{new: true},
					(err,video)=> {
						if(err) return res.send(err)
						res.send(video)
					}
				)
			})
		})
	})
}

var storage = multer.diskStorage({})
var upload = multer({ storage: storage }).single('video')

router.post('/:id', (req, res, next)=> {
	qiniu.conf.ACCESS_KEY = process.env.QN_ACCESS
	qiniu.conf.SECRET_KEY = process.env.QN_SECRET
	var bucket = 'tp-video'
	  , saved_bucket = 'tp-cover'
	  , key = 'mv' + Date.now() + '.mp4'
	  , saved_key = 'co' + Date.now() + '.jpg'
	  , pipeline = 'xcxcx'
	  , fops = 'vframe/jpg/offset/2/w/480/h/360/rotate/auto'
	  , saveas_key = qiniu.util.urlsafeBase64Encode(saved_bucket+':'+saved_key)
	  , fops = fops+'|saveas/'+saveas_key
	function uptoken(bucket, key) {
		var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key)
		putPolicy.persistentOps = fops
		putPolicy.persistentPipeline = pipeline
		return putPolicy.token()
	}
	qntoken = uptoken(bucket, key)
	function uploadFile(uptoken, key, localFile) {
		var extra = new qiniu.io.PutExtra()
		qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
			if(!err) {
				createVideo(saved_key, ret.key, req.params.id, res)
			} else {
				res.send(err)
			}
		})
	}
	upload(req, res, (err) => {
		if(err) return res.send(err)
		Video.findOne({_id: req.params.id})
		.where('poster').equals(req.uid)
		.exec((err, video)=> {
			if(err) return res.send(err)
			else if(!video) return res.send({error: 'Not found the video'})
			if(video.video_url) return res.send({warning: 'Video has been uploaded'})
			uploadFile(qntoken, key, req.file.path)
		})
	})	
})

module.exports = router
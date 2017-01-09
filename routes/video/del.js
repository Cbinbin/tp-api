const router = require('express').Router()
	, qiniu = require('qiniu')
    , fs = require('fs')
    , Info = require('../../models/Info')
    , Video = require('../../models/Video')
    , VideoUrl = require('../../models/VideoUrl')
    , Cover = require('../../models/Cover')
    , heroku = require('../../hostUrl')

function unlinkfile(url) {
	fs.unlink(url.substring(21), (err)=> {
		if(err) return console.log(err)
		console.log(`${url} deleted success`)
	})
}
function rmdoc(model, id) {
	model.remove({_id: id})
	.exec((err)=> {
		if(err) return console.log(err)
		console.log(`${id} deleted success`)
	})
}
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

router.delete('/:id', (req, res)=> {
	qiniu.conf.ACCESS_KEY = process.env.QN_ACCESS
	qiniu.conf.SECRET_KEY = process.env.QN_SECRET
	var bucket_cover = 'tp-cover'
	  , bucket_video = 'tp-video'
	  , key_cover
	  , key_video
	Video.findOne({_id: req.params.id})
	.populate('video_url', 'vid_url')
	.populate('cover', 'cover_url')
	.exec((err, vid)=> {
		if(err) return res.send(err)
		else if(!vid) return res.send({error: 'Not found the video Id'})
		if(String(vid.poster) == req.uid) {
			if(vid.cover) {
				key_cover = vid.cover.cover_url.substring(33)
				rmkey(bucket_cover, key_cover)
				rmdoc(Cover, vid.cover._id)
			}
			if(vid.video_url) {
				key_video = vid.video_url.vid_url.substring(33)
				rmkey(bucket_video, key_video)
				rmdoc(VideoUrl, vid.video_url._id)
			}
			Info.update({_id: req.uid},
			{$pull: {pub_videos: req.params.id}},
			(err, success)=> {
				if(err) return console.log(err)
				console.log(success)
			})
			vid.remove((err)=> {
				if(err) return res.send(err)
				res.send('video deleted success')
			})
		} 
		else res.json('not the author')
	})
})

module.exports = router
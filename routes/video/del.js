const router = require('express').Router()
    , fs = require('fs')
    , Info = require('../../models/Info')
    , Video = require('../../models/Video')
    , VideoUrl = require('../../models/VideoUrl')
    , Cover = require('../../models/Cover')

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

router.delete('/:id', (req, res)=> {
	Video.findOne({_id: req.params.id})
	.populate('video_url', 'vid_url')
	.populate('cover', 'cover_url')
	.exec((err, vid)=> {
		if(err) return res.send(err)
		else if(!vid) return res.send({error: 'Not found the video Id'})
		if(String(vid.poster) == req.uid) {
			unlinkfile(vid.video_url.vid_url)
			unlinkfile(vid.cover.cover_url)
			rmdoc(VideoUrl, vid.video_url._id)
			rmdoc(Cover, vid.cover._id)
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
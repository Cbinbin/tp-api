const router = require('express').Router()
    , Info = require('../../models/Info')
    , Video = require('../../models/Video')

router.post('/', (req, res)=> {    //?token=${token}
	const vid = new Video({
		poster: req.uid,
		title: req.body.title,    //标题(必填)
		video_url: null,
		cover: null,
		channel: req.body.channel || 'hot',
		view_number: 0,
		like_number: 0,
		comment_number: 0,
		comments: []
	})
	vid.save((err)=> {
		if(err) return res.send(err)
		Info.findOneAndUpdate(
			{_id: req.uid},
			{$push: {pub_videos: vid._id}},
			(err)=> {
				if(err) return res.send(err)
			}
		)
		res.send(vid)
	})
})

module.exports = router
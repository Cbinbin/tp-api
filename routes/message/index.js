const router = require('express').Router()
    , Message = require('../../models/Message')

router.get('/', (req, res)=> {
	Message.find({ownerId: req.uid}, {__v: 0})
	.populate('anotherId', 'nickname thumbnail head_pic follows fans pub_videos')
	.populate({path: 'videoId',
		select: 'poster title video_url cover channel view_number like_number comments',
		populate: {
			path: 'video_url cover',
			select: 'vid_url cover_url'
		}
	})
	.populate('commentId', 'remark')
	.exec((err, messages)=> {
		if(err) return res.send(err)
		res.send(messages)
	})
})

module.exports = router
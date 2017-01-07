const router = require('express').Router()
    , Info = require('../../models/Info')

router.get('/', (req, res)=> {
	Info.findOne({_id: req.uid}, {openid:0, sex:0,  signature:0, __v:0})
	.populate({path: 'favorites',
		select: 'poster title video_url cover channel view_number like_number comments',
		populate: {
			path: 'poster video_url cover',
			select: 'nickname vid_url cover_url'
		}
	})
	.exec((err, info)=> {
		if(err) return res.send(err)
		else if(!info) return res.send({error: 'Not found info Id'})
		res.send(info)
	})
})

module.exports = router
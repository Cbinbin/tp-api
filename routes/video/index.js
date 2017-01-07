const router = require('express').Router()
    , Video = require('../../models/Video')
    , Comment = require('../../models/Comment')

router.get('/', (req, res)=> {
	const per = Number(req.query.per) || 5
        , page = Number(req.query.page) || 1
	Video.find()
	.populate('poster', 'nickname thumbnail head_pic follows pub_videos')
	.populate('video_url', 'vid_url')
	.populate('cover', 'cover_url')
	.populate('comments', 'chatTF commenter remark answer laud remark_time')
	.sort({view_number: -1})
	.limit(per)
	.skip((page - 1) * per)
	.exec((err, vids)=> {
		if(err) return res.send(err)
		res.send(vids)
	})
})

router.get('/sort', (req, res)=> {    //?channel=${channel}
	const per = Number(req.query.per) || 5
        , page = Number(req.query.page) || 1
	Video.find()
	.where('channel').equals(req.query.channel)
	.populate('poster', 'nickname thumbnail head_pic follows pub_videos')
	.populate('video_url', 'vid_url')
	.populate('cover', 'cover_url')
	.populate('comments', 'chatTF commenter remark answer laud remark_time')
	.sort({view_number: -1})
	.limit(per)
	.skip((page - 1) * per)
	.exec((err, vids)=> {
		if(err) return res.send(err)
		res.send(vids)
	})
})

router.get('/:id', (req, res)=> {
	Video.findOne({_id: req.params.id})
	.populate('poster', 'nickname thumbnail head_pic follows pub_videos')
	.populate('video_url', 'vid_url')
	.populate('cover', 'cover_url')
	.populate('comments', 'chatTF commenter remark answer laud laud_number remark_time')
	.exec((err, vid)=> {
		if(err) return res.send(err)
		else if(!vid) return res.json('Nothing')
		res.send(vid)
	})
})

router.patch('/:id/channel', (req, res)=> {
	Video.findOne({_id: req.params.id})
	.exec((err, vid)=> {
		if(err) return res.send(err)
		vid.channel = req.body.channel || vid.channel
		vid.save((err)=> {
			if(err) return res.send(err)
			res.send(vid)
		})
	})	
})

router.get('/comment/:id', (req, res)=> {
	Comment.findOne({_id: req.params.id})
	.populate('commenter', 'nickname thumbnail head_pic')
	.populate({path: 'answer', 
		select: 'chatTF commenter remark answer laud laud_number remark_time', 
		populate: {
			path: 'commenter',
			select: 'nickname thumbnail head_pic' 
		}
	})
	.exec((err, comment)=> {
		if(err) return res.send(err)
		else if(!comment) return res.send({error: 'Not found this comment'})
		res.send(comment)
	})
})

module.exports = router
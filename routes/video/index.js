const router = require('express').Router()
    , Video = require('../../models/Video')
    , Comment = require('../../models/Comment')
    , qiniu = require('qiniu')
    , heroku = require('../../hostUrl')

router.get('/', (req, res)=> {
	const per = Number(req.query.per)
        , page = Number(req.query.page)
	Video.find()
	.populate('poster', 'nickname thumbnail head_pic follows pub_videos')
	.populate('video_url', 'vid_url')
	.populate('cover', 'cover_url')
	.populate('comments', 'chatTF commenter remark answer laud remark_time')
	.limit(per)
	.skip((page - 1) * per)
	.exec((err, vids)=> {
		if(err) return res.send(err)
		res.send(vids)
	})
})

router.get('/new', (req, res)=> {
	const per = Number(req.query.per) || 5
        , page = Number(req.query.page) || 1
	Video.find()
	.populate('poster', 'nickname thumbnail head_pic follows pub_videos')
	.populate('video_url', 'vid_url')
	.populate('cover', 'cover_url')
	.populate('comments', 'chatTF commenter remark answer laud remark_time')
	.sort({create_time: -1})
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

router.get('/sort/new', (req, res)=> {    //?channel=${channel}
	const per = Number(req.query.per) || 5
        , page = Number(req.query.page) || 1
	Video.find()
	.where('channel').equals(req.query.channel)
	.populate('poster', 'nickname thumbnail head_pic follows pub_videos')
	.populate('video_url', 'vid_url')
	.populate('cover', 'cover_url')
	.populate('comments', 'chatTF commenter remark answer laud remark_time')
	.sort({create_time: -1})
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
	.populate({path: 'comments',
            select: 'chatTF commenter remark answer laud laud_number remark_time',
            populate: {path: 'commenter',
                  select: 'nickname thumbnail head_pic' }
      })
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

router.get('/:id/download', (req, res)=> {
	qiniu.conf.ACCESS_KEY = process.env.QN_ACCESS
	qiniu.conf.SECRET_KEY = process.env.QN_SECRET
	Video.findOne({_id: req.params.id})
	.populate('video_url', 'vid_url')
	.exec((err, vid)=> {
		if(err) return res.send(err)
		else if(!vid) return res.send({error: 'Not found the video Id'})
		if(!vid.video_url) return res.send({error: 'Not found the video_url'})
		var url = vid.video_url.vid_url + '?attname='
		  , policy = new qiniu.rs.GetPolicy()
		  , downloadUrl = policy.makeRequest(url)
		res.send({downloadUrl: downloadUrl})
	})
})

module.exports = router

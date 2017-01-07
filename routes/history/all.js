const router = require('express').Router()
    , Video = require('../../models/Video')
    , Info = require('../../models/Info')
    , History = require('../../models/History')

router.get('/', (req, res)=> {
	History.find({ownerId: req.uid}, {create_time: 0, __v: 0})
	.populate('ownerId', 'nickname')
	.populate({path: 'videoId', 
		select: 'poster　title video_url cover view_number like_number comment_number', 
		populate: {
			path: 'poster cover',    //2个参数
			select: '-_id　nickname cover_url' 
		}
	})
	.exec((err, his)=> {
		if(err) return res.send(err)
		res.send(his)
	})
})

router.delete('/del', (req, res)=> {
	History.remove({ownerId: req.uid})
	.exec((err)=> {
		if(err) return res.send(err)
		res.json('your history has been deleted')
	})
	Info.update({openid: req.opid},
	{$set: {history: []}},
	(err, txt)=> {
		if(err) return console.log(err)
		console.log(txt)
	})
})

module.exports = router
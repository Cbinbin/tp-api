const router = require('express').Router()
    , Info = require('../../models/Info')
    , Video = require('../../models/Video')
    , Comment = require('../../models/Comment')
    , Message = require('../../models/Message')

function addMessage3(me, another, vid, cid) {
	const mes = new Message({
		ownerId: me,
		anotherId: another,
		videoId: vid,
		commentId: cid,
		kinds: 3
	})
	mes.save((err)=> {
		if(err) return console.log(err)
		console.log(mes)
	})
}

router.post('/', (req, res)=> {
	Video.findOne({_id: req.query.vid})
	.exec((err, video)=> {
		if(err) return res.send(err)
		else if(!video) return res.send({error: 'Not found the video Id'})
		const cmet = new Comment({
			video_id: video._id,
			chatTF: false,
			commenter: req.uid,
			remark: req.body.remark,
			answer: req.body.answer || [],
			laud: req.body.laud || [],
			laud_number: req.body.laud || 0,
		})
		cmet.save((err)=> {
			if(err) return res.send(err)
			Video.update({_id: video._id},
			{ $push: {comments: cmet._id}
			, $inc: {comment_number: 1}},
			(err, txt)=> {
				if(err) return console.log(err)
				console.log(txt)
			})
			addMessage3(video.poster, req.uid, video._id, cmet._id)
                     Comment.findOne({_id: cmet._id})
                     .populate('commenter', 'head_pic nickname')
                     .exec((err, cmett)=> {
                            if(err) return res.send(err)
			       res.send(cmett)
                     })
		})
	})
})

router.delete('/:cid', (req, res)=> {
	Comment.findOne({_id: req.params.cid})
	.exec((err, comment)=> {
		if(err) return res.send(err)
		else if(!comment) return res.send({error: 'Not found comment Id'})
		if(String(comment.commenter) == req.uid) {
			comment.answer.map((item)=> {
				Comment.remove({_id: item})
				.exec((err)=> {
					if(err) return console.log(err)
					console.log('answer deleted success')
				})
			})
			Video.update({_id: comment.video_id},
			{$pull: {comments: comment._id},
		     $inc: {comment_number: -1}},
			(err, txt)=> {
				if(err) return console.log(err)
				console.log(txt)
			})
			comment.remove((err)=> {
				if(err) return res.send(err)
				res.send('comment deleted success')
			})
		}
		else res.json('not the author')
	})
})

module.exports = router

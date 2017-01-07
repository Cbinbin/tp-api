const router = require('express').Router()
    , Video = require('../../models/Video')
    , Comment = require('../../models/Comment')

router.post('/', (req, res)=> {
	Comment.findOne({_id: req.query.cid})
	.exec((err, cmet)=> {
		if(err) return res.send(err)
		else if(!cmet) return res.send({error: 'Not found comment Id'})
		const answer = new Comment({
			video_id: cmet.video_id,
			chatTF: true,
			commenter: req.uid,
			remark: req.body.remark,
			answer: req.body.answer || [],
			laud: req.body.laud || [],
			laud_number: req.body.laud || 0,
		})
		answer.save((err)=> {
			if(err) return res.send(err)
			Comment.update({_id:cmet._id},
			{$push: {answer: answer._id}},
			(err, txt)=> {
				if(err) return res.send(err)
				console.log(txt)
			})
			Video.update({_id: cmet.video_id}, 
			{$inc: {comment_number: 1}}, 
			(err, txt)=> {
				if(err) return console.log(err)
				console.log(txt)
			})
			res.send(answer)
		})
	})
})

module.exports = router
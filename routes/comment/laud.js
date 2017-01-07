const router = require('express').Router()
    , Comment = require('../../models/Comment')

router.post('/', (req, res)=> {
	Comment.findOne({_id: req.query.cid})
	.where('laud').in([req.uid])
	.exec((err, same)=> {
		if(same) {
			Comment.findOneAndUpdate({_id: same._id},
			{$pull: {laud: req.uid},
			 $inc: {laud_number: -1}},
			{new: true},
			(err, comment)=>{
				if(err) return res.send(err)
				res.send(comment)
			})
			return
		}
		Comment.findOneAndUpdate({_id: req.query.cid},
		{$push: {laud: req.uid},
		 $inc: {laud_number: 1}},
		{new: true},
		(err, comment)=>{
			if(err) return res.send(err)
			res.send(comment)
		})
	})
})

module.exports = router
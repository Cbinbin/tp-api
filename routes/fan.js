const router = require('express').Router()
    , Info = require('../models/Info')
    , Message = require('../models/Message')

function addMessage(me, another) {
	const mes = new Message({
		ownerId: me,
		anotherId: another,
		kinds: 1
	})
	mes.save((err)=> {
		if(err) return console.log(err)
		console.log(mes)
	})
}

router.post('/:ifid', (req, res)=> {
	Info.findOne({_id: req.params.ifid})
	.exec((err, info)=> {
		if(err) return res.send(err)
		else if(!info) return res.send({error: 'Not found info Id'})
		Info.findOne({_id: req.uid})
		.where('follows').in([req.params.ifid])
		.exec((err, same)=> {
			if(same) {
				Info.update({_id: req.params.ifid},
				{$pull: {fans: same._id}},
				(err, txt)=> {
					if(err) return console.log(err)
					console.log(txt)
				})
				Info.findOneAndUpdate({_id: same._id},
				{$pull: {follows: req.params.ifid}},
				{new: true}, 
				(err, newinfo)=> {
					if(err) return res.send(err)
					res.send(newinfo)
				})
				return 
			}
			Info.update({_id: req.params.ifid},
			{$push: {fans: req.uid}},
			(err, txt)=> {
				if(err) return console.log(err)
				console.log(txt)
			})
			Info.findOneAndUpdate({_id: req.uid},
			{$push: {follows: req.params.ifid}},
			{new: true}, 
			(err, newinfo)=> {
				if(err) return res.send(err)
				res.send(newinfo)
			})
			addMessage(req.params.ifid, req.uid)
		})
	})
})

module.exports = router
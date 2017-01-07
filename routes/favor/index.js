const router = require('express').Router()
    , Info = require('../../models/Info')
    , Video = require('../../models/Video')
    , Message = require('../../models/Message')

function addMessage2(me, another, vid) {
	const mes = new Message({
		ownerId: me,
		anotherId: another,
		videoId: vid,
		kinds: 2
	})
	mes.save((err)=> {
		if(err) return console.log(err)
		console.log(mes)
	})
}

router.post('/', (req, res)=> {
	Video.findOne({_id: req.query.vid})
	.exec((err, vid)=> {
		if(err) return res.send(err)
		else if(!vid) return res.send({error: 'Not found the video Id'})
		Info.findOne({_id: req.uid})
		.where('favorites').in([vid._id])
		.exec((err, same)=> {
			if(same) {
				Info.findOneAndUpdate({_id: req.uid},
				{$pull: {favorites: vid._id}},
				{new: true},
				(err, info)=> {
					if(err) return res.send(err)
					res.send(info)
				})
				Video.update({_id: req.query.vid},
				{$inc: {like_number: -1}},
				(err, txt)=> {
					if(err) return console.log(err)
				})
				return
			}
			Info.findOneAndUpdate({_id: req.uid},
			{$push: {favorites: vid._id}},
			{new: true},
			(err, info)=> {
				if(err) return res.send(err)
				res.send(info)
			})
			Video.update({_id: req.query.vid},
			{$inc: {like_number: 1}},
			(err, txt)=> {
				if(err) return console.log(err)
			})
			addMessage2(vid.poster, req.uid, vid._id)
		})
	})
})

module.exports = router
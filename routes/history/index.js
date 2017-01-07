const router = require('express').Router()
    , Info = require('../../models/Info')
    , Video = require('../../models/Video')
    , History = require('../../models/History')

function pushHistory(model, mId, hId, res) {
	model.findOneAndUpdate({_id: mId}, 
	{$push: {history: hId}}, 
	{new: true}, 
	(err, update)=> {
		if(err) return res.send(err)
		res.send(update)
	})
}
function incViewnum(model, vId) {
	model.update({_id: vId}, 
	{$inc: {view_number: 1}}, 
	(err, txt)=> {
		if(err) console.log(err)
		console.log(txt)
	})
}

router.post('/', (req, res)=> {
	Video.findOne({_id: req.query.vid})
	.exec((err, vid)=> {
		if(err) return res.send(err)
		else if(!vid) return res.send({error: 'Not found the video Id'})
		History.findOne({videoId: vid._id})
		.where('ownerId').equals(req.uid)
		.exec((err, same)=> {
			if(same) {
				History.findOneAndUpdate({_id: same._id},
				{videoId: same.videoId},
				{new: true},
				(err, his)=> {
					if(err) return res.send(err)
					res.send(his)
				})
				return
			}
			const his = new History({
				ownerId: req.uid,
				videoId: vid._id
			})
			his.save((err)=> {
				if(err) return res.send(err)
				pushHistory(Info, req.uid, his._id, res)
			})
		})
		incViewnum(Video, vid._id)
	})
})

module.exports = router
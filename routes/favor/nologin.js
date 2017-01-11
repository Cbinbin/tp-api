const router = require('express').Router()
    , Video = require('../../models/Video')

router.patch('/:id/inc', (req, res)=> {
	Video.findOneAndUpdate({_id: req.params.id}, 
	{$inc: {like_number: 1}}, 
	{new: true}, 
	(err, video)=> {
		if(err) return res.send(err)
		else if(!video) return res.send({error: 'Not found the video'})
		res.send(video)
	})
})

router.patch('/:id/sub', (req, res)=> {
	Video.findOneAndUpdate({_id: req.params.id}, 
	{$inc: {like_number: -1}}, 
	{new: true}, 
	(err, video)=> {
		if(err) return res.send(err)
		else if(!video) return res.send({error: 'Not found the video'})
		res.send(video)
	})
})

module.exports = router
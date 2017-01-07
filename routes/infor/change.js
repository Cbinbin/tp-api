const router = require('express').Router()
    , Info = require('../../models/Info')

router.patch('/', (req, res)=> {
	Info.findOne({openid: req.opid})
	.exec((err, user)=> {
		if(err) return res.send(err)
		else if(!user) return res.send({error: 'Not found info Id'})
		Info.findOneAndUpdate({openid: req.opid}, 
		{$set: {nickname: req.body.nickname || user.nickname
			, sex: req.body.sex || user.sex
			, signature: req.body.signature || user.signature}},
		{new: true, strict: true}, 
		(err, info)=> {
			if(err) return res.send(err)
			res.send(info)
		})
	})
})

module.exports = router
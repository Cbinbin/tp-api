const router = require('express').Router()
    , jwt = require('jsonwebtoken')
    , Login = require('../models/Login')
    , Info = require('../models/Info')

router.post('/', (req, res)=> {
	Login.findOne({phone: req.body.phone}) 
	.exec((err,user) => {
		if(!user) return res.send({error: '找不到此手机号'})
		if(user.password === req.body.password) {
			Info.findOne({openid: user._id})
			.exec((err, info)=> {
				jwt.sign(
					{uId: info._id, opId: info.openid},
					'guojing',
					{expiresIn: '7d'}, 
					(err, token) => {
						if(err) return res.send(err)
		        		res.send({token: token})					
					}
				)
			})
		}
		else return res.send({error: '密码错误'})
	})
})

module.exports = router
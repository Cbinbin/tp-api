const router = require('express').Router()
    , Login = require('../models/Login')
    , Info = require('../models/Info')

function builtInfo(openid) {
	const info = new Info({
    	openid: openid,
		nickname: '暂无昵称',
		sex: '0',
		signature: '新潮',
		thumbnail:　null,
		head_pic: null,
		pub_videos: [],
		follows: [],
		fans: [],
		favorites: [],
		history: []
    })
    info.save((err)=> {
    	if(err) return console.log(err)
    	console.log(info)
    })
}

router.post('/', (req, res)=> {
	var re = /[^\w\u4e00-\u9fa5]/g
	Login.findOne({phone: req.body.phone}) 
	.exec((err, same) => {
		if(same) return res.send({error: '该手机号已被使用过'})
		if(req.body.phone == null) return res.send({warning: '手机号不能为空'})
		else if(req.body.phone.split("", 1) == 0) return res.send({warning: '手机号首位不能为0'})
		if(re.test(req.body.password)) return res.send({warning: '密码只能为数字,字母或下划线'})
		const log = new Login({
			phone: req.body.phone,
			password: req.body.password,
		})
		log.save((err)=> {
			if(err) return res.send(err)
			builtInfo(log._id)
			res.send(log)
		})
	})
})

module.exports = router
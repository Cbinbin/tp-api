const router = require('express').Router()
	, request = require('superagent')
	, jwt = require('jsonwebtoken')
	, wxApis = require('../utils/wxApis')
	, WXBizDataCrypt = require('../utils/WXBizDataCrypt')
	, Info = require('../models/Info')

function setinfo(openid, nickname, sex, headpic, res) {
	Info.findOne({openid: openid})
	.exec((err, same)=> {
		if(same) {
			console.log(same)
			jwt.sign(
	    		{uId: same._id, opId: same.openid},
	    		'guojing', 
	    		{expiresIn: '7d'}, 
	    		(err, token)=> {
	    			if(err) return res.send(err)
	    			res.send({token: token})
	    		}
	    	)
		} else {
			const info = new Info({
		    	openid: openid,
				nickname: nickname,
				sex: sex,
				signature: '新潮',
				thumbnail:　null,
				head_pic: headpic,
				pub_videos: [],
				follows: [],
				fans: [],
				favorites: [],
				history: []
		    })
		    info.save((err)=> {
		    	if(err) return res.send(err)
		    	jwt.sign(
		    		{uId: info._id, opId: info.openid},
		    		'guojing', 
		    		{expiresIn: '7d'}, 
		    		(err, token)=> {
		    			if(err) return res.send(err)
		    			res.send({token: token})
		    		}
		    	)
		    })
		}
    	
	})
}

router.get('/', (req, res)=> {
	const code = req.query.code
		, iv = req.query.iv 
    	, encryptedData = req.query.encryptedData
    	, xcxId = process.env.XCX_ID
		, xcxSecret = process.env.XCX_SECRET
    if (!code || !iv || !encryptedData)
    	return res.send({message: 'Missing Query String!'})
    request.get(`${wxApis.session}?appid=${xcxId}&secret=${xcxSecret}&js_code=${code}&grant_type=authorization_code`)
    .end((err, result)=> {
    	if(!JSON.parse(result.text).errcode) {
	    	const sessionKey = JSON.parse(result.text).session_key
	    	const pc = new WXBizDataCrypt(xcxId, sessionKey)
	        const wxInfo = pc.decryptData(encryptedData, iv)
	        console.log(wxInfo)
	        setinfo(wxInfo.openId, wxInfo.nickName, wxInfo.gender, wxInfo.avatarUrl, res)
    	}
    	else res.send(result.text)
    })
})

module.exports = router
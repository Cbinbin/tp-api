const jwt = require('jsonwebtoken')

function checkToken(router) {
	router.use('*', (req, res, next)=> {
		const token = req.query.token
		jwt.verify(token, 'guojing', (err, gj)=> {
			if(err) return res.send(err)
			req.uid = gj.uId
			req.opid = gj.opId
			next()
		})
	})
}

module.exports = checkToken
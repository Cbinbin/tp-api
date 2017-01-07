const express = require('express')
    , app = express()
    , port = process.env.PORT || 3333
    , routes = require('./routes')
    , user = require('./routes/user_r')
    , video = require('./routes/video')
    , info = require('./routes/infor/get')

const cors = require('cors')
    , bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/public', express.static('public'))

require('./mongodb')
require('dotenv').config()

app.use('/', routes.home)
app.use('/reg', routes.reg)
app.use('/login', routes.login)
app.use('/session', routes.session)
app.use('/search', routes.search)
app.use('/yzm', routes.yzm)
app.use('/user', user)
app.use('/video', video)
app.use('/info', info)

app.listen(port, ()=> {
	console.log('Server is ruuning on port: ' + port)
	console.log('Use Ctrl-C to stop')
})
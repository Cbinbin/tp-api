const router = require('express').Router()
    , index = require('./favor')
    , get = require('./favor/get')

router.use('/', index)
router.use('/get', get)

module.exports = router
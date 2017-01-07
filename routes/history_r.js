const router = require('express').Router()
    , index = require('./history')
    , all = require('./history/all')

router.use('/', index)
router.use('/all', all)

module.exports = router
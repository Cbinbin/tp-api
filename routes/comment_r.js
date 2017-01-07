const router = require('express').Router()
    , index = require('./comment')
    , answer = require('./comment/answer')
    , laud = require('./comment/laud')

router.use('/', index)
router.use('/answer', answer)
router.use('/laud', laud)

module.exports = router
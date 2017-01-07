const router = require('express').Router()
    , detail = require('./video/detail')
    , push = require('./video/push')
    , frame = require('./video/frame')
    , del = require('./video/del')
    , other = require('./video/other')

router.use('/', other)
router.use('/frame', frame)
router.use('/detail', detail)
router.use('/push', push)
router.use('/del', del)

module.exports = router
const router = require('express').Router()
      , Info = require('../../models/Info')

router.get('/', (req, res)=> {
  Info.findOne({_id: req.uid}, {openid: 0, sex: 0, signature: 0, info_time: 0})
  .populate('fans', 'nickname head_pic thumbnail fans')
  .exec((err, fans)=> {
    if(err) return res.send(err)
    res.send(fans)
  })
})

module.exports = router

const router = require('express').Router()
      , Video = require('../../models/Video')

router.get('/', (req, res)=> {
  const per = Number(req.query.per)
        , page = Number(req.query.page)
  Video.find({poster: req.uid})
  .populate('poster', 'head_pic thumbnail')
  .populate('cover', 'cover_url')
  .populate('video_url', 'vid_url')
  .limit(per)
  .skip((page - 1) * per)
  .sort({create_time: -1})
  .exec((err, videos)=> {
    if(err) return res.send(err)
    res.send(videos)
  })
})

module.exports = router

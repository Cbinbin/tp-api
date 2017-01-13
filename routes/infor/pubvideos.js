const router = require('express').Router()
    , Video = require('../../models/Video')

router.get('/', (req, res)=> {
  Video.find({poster: req.uid})
  .populate('poster', 'head_pic thumbnail')
  .populate('cover', 'cover_url')
  .populate('video_url', 'vid_url')
  .exec((err, videos)=> {
    if(err) return res.send(err)
    res.send(videos)
  })
})

module.exports = router

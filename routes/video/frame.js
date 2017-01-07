const router = require('express').Router()
    , ffmpeg = require('ffmpeg')

router.post('/',(req, res)=> {
	try{
		var proces = new ffmpeg('public/videos/1482807253367.mp4')
		proces.then(function(video) {
			video.fnExtractFrameToJPG('public/covers', {
				frame_rate: 1,
				number: 1,
				file_name: 'c' + Date.now()
			}, (error, files)=> {
				if(!error) res.send('Frames: ' + files[files.length-1])
			})
		}, function(err) {
			console.log('Error: ' + err)
		})
	} catch(e) {
		console.log(e.code)
		res.send(e.msg)
	}
})

module.exports = router
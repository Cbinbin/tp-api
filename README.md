# tp-api
this is api that imitate the operation of Toupai.
   
远程: http://tp.newteo.com/   or    http://copytp.herokuapp.com/    
数据库mongodb: mongo ds149268.mlab.com:49268/tplibrary -u tpapi -p tpapi    
   
## token
> ### 小程序登录
```js
GET    http://localhost:3333/session?code=${code}&iv=${iv}&encryptedData=${encryptedData}
```
=> token: 'token'
注：   
code: 小程序APIwx.login()返回的code   
iv: 小程序APIwx.getUserInfo()返回的iv   
encryptedData: 小程序APIwx.getUserInfo()返回的encryptedData   


> ### app登录
>> #### 注册
```js
POST    http://localhost:3333/reg
```
```js
{
	phone: ${phone},    //手机号 (Number)
	password: ${password}    //密码 (String)
}
```
=> 号码密码及Id
>> #### 登录
```js
POST    http://localhost:3333/login
```
```js
{
	phone: ${phone},
	password: ${password}
}
```
=> token: 'token'   
注：信息已默认生成，直接用 token 获取信息和更改信息   


## 我的
> ### 信息获取
```js
GET    http://localhost:3333/user/info?token=${token}
```
=> 返回   
```js
{
	"_id": "xxx",    //使用者Id (ObjectId)
	"openid": "xxx",    //openId (Id)
	"nickname": "xxx",    //昵称 (String)
	"sex": "xxx",    //性别 (String)
	"signature": "xxx",    //签名 (String)
	"thumbnail": "xxx",    //缩略图 (ObjectId)
	"head_pic": "xxx",    //头像 (String)
	"info_time": "xxx",    //时间 (Date)
	"history": [],    //播放历史 (Array[ObjectId])
	"favorites": [],    //喜欢的视频 (Array[ObjectId])
	"fans": [],    //粉丝 (Array[ObjectId])
	"follows": [],    //关注 (Array[ObjectId])
	"pub_videos": []    //发布的视频 (Array[ObjectId])
}
```
还可通过以下获取   
```js
GET    http://localhost:3333/info
```
```js
GET    http://localhost:3333/info/:id    // id 为 我的信息的Id
```

> ### 改信息
```js
PATCH    http://localhost:3333/user/change?token=${token}
```
```js
{
	"nickname": ${nickname},    //昵称 (String)
	"sex": ${sex},    //性别 (String) '1': 男, '2': 女, '0': 未知
	"signature": ${signature}    //签名 (String)
}
```
可选，没更改按原来的   
> ### 头像
1. 上传
```js
POST    http://localhost:3333/user/headimg?token=${token}
```
key: headimg    
2. 改
```js
POST    http://localhost:3333/user/headimg/r?token=${token}
```

> ### 缩略图
1. 上传
```js
POST    http://localhost:3333/user/thn?token=${token}
```
key: thnimg    
2. 改
```js
POST    http://localhost:3333/user/thn/r?token=${token}
```

## video
*按以下2个步骤发布视频*
> ### 1.添加标题(可包含频道)
```js
POST    http://localhost:3333/user/video/detail?token=${token}
```
scsId 为 video 截图的Id   
```js
{
	"title": ${title},    //标题 (String) 
	//"channel": ${channel}    //频道 (String)
	//"length": ${length}     //时长(String)
}
```
=> 视频信息及Id     
```js
{
	"_id": "xxx",    //视频Id (ObjectId)
	"poster": "xxx",    //上传者Id (ObjectId)
	"title": "xxx",    //标题 (String)
	"video_url": "xxx",    //视频链接Id (ObjectId)
	"cover": "xxx",    //视频截图Id (ObjectId)
	"channel": "xxx",    //频道 (String)
	"length": "xxx",	//时长(String)
	"view_number": 0,    //观看人数 (Number)
	"like_number": 0,    //喜欢人数 (Number)
	"comment_number": 0,    //评论人数 (Number)
	"create_time": "xxx",    //创建时间 (Date)
	"comments": []    //评论Id (Array[ObjectId])
}
```
> ### 2.发布video
```js
POST    http://localhost:3333/user/video/push/:videoId?token=${token}
```
key: video     
// videoId为上一步的信息Id   
=> 视频路径及Id       
> ### 删除video
```js
DELETE    http://localhost:3333/user/video/del/:videoId?token=${token}
```
=> video deleted success    
> ### 获取video下载链接
```js
GET    http://localhost:3333/video/:videoId/download
```
=> 
```js
{
	downloadUrl: ${downloadUrl}
}
```

----
> ### 获取全部video(按观看人数降序排列)
```js
GET    http://localhost:3333/video/?per=${per}&page=${page}
```
per: 个数   
page:　页数   
> ### 获取全部video(按上传时间从新到旧排列)
```js
GET    http://localhost:3333/video/new?per=${per}&page=${page}
```
    
> ### 获取video
```js
GET    http://localhost:3333/video/:videoId
```

> ### 按频道获取video
```js
GET    http://localhost:3333/video/sort?channel=${channel}&per=${per}&page=${page}
```
per: 个数   
page:　页数   
eg. channel = 热门

> ### 给video换频道
```js
PATCH    http://localhost:3333/video/:videoId/channel
```
```js
{
	"channel": ${channel}	//'hot'('热门'), 'dobe'('逗比'), 'curious'('猎奇'), 'entertainment'('娱乐'), 'interCelebrity'('网红'), 'society'('社会'), 'goddess'('女神'), 'movies'('影视'), 'music'('音乐'), 'comic'('动漫'), 'pet'('萌宠'), 'sports'('体育')
}
```
----
> ### 添加视频评论
```js
POST    http://localhost:3333/user/comment/?vid=${vid}&token=${token}
```
vid 为 视频Id
```js
{
	"remark": "xxx"    //写评论
}
```
=>  返回
```js
{
	"_id": "xxx",    //评论信息Id (ObjectId)
	"video_id": "xxx",    //视频Id (ObjectId)
	"chatTF": false(or 'true'),    //false为评论，true为回复 (Boolean)
	"commenter": "xxx",    //评论者Id (ObjectId)
	"remark": "xxx",    //写评论 (String)
	"laud_number": 0,    //点赞人数 (Number)
	"remark_time": "xxx",    //评论时间 (Date)
	"laud": [],    //点赞者Id (Array[ObjectId])
	"answer": []    //回复者Id (Array[ObjectId])
}
```

> ### 回复他人评论
```js
POST    http://localhost:3333/user/comment/answer?cid=${cid}&token=${token}
```
cid 为 评论Id
```js
{
	"remark": "xxx"    //写评论
}
```
=> 返回和添加评论的一样 

> ### 点赞他人评论
```js
POST    http://localhost:3333/user/comment/laud?cid=${cid}&token=${token}
```
// 多　post　一次取消点赞     
=> 他人评论内容    

> ### 查看评论
```js
GET    http://localhost:3333/video/comment/:cid
```
// cid　为评论Id    
=> 返回   
```js
{
	"_id": "xxx",    //评论Id (ObjectId)
	"video_id": "xxx",    //视频Id (ObjectId)
	"chatTF": false,    //判断 (Boolean)
	"commenter": {...},    //评论者信息 (Object)
	"remark": "xxx",    //写评论 (String)
	"laud_number": 0,    //点赞人数 (Number)
	"remark_time": "xxx",    //评论时间 (Date)
	"laud": [],    //点赞者Id (Array[ObjectId])
	"answer": [    //回复者信息 (Array[Object])
		{
			"_id": "xxx",
			"chatTF": true,
			"commenter": {},
			"remark": "xxx",
			"laud_number": 0,
			"remark_time": "xxx",
			"laud": [],
			"answer": []
		}
	]
}
```

> ### 删除评论
```js
DELETE    http://localhost:3333/user/comment/:cid?token=${token}
```
// 删除评论，连同第一级回复    
=> comment deleted success    

----
## 播放历史
> ### 增加某个播放历史
```js
POST    http://localhost:3333/user/history/?vid=${vid}&token=${token}
```
//vid为视频Id，view_number只增无减　   
未播放过   
=>　我的信息   
播放过(视频的view_number也会增加)   
=> 历史信息(view_time为更新时间)   

> ### 获取播放历史
```js
GET    http://localhost:3333/user/history/all?token=${token}
```
```js
{
	"_id":"xxx",    //历史Id (ObjectId)    
	"view_time":"xxx",    //播放的时间 (Date)，再一次 post 会更新
	"ownerId": {
		"_id": "xxx",    //使用者Id (ObjectId)
		"nickname":"xxx"    //昵称 (String)
	},
	"videoId": {
		"_id":"xxx",    //视频Id (ObjectId)
		"poster": {
			"nickname": "xxx"    //上传者昵称 (String)
		},
		"title":"xxx",    //标题 (String)
		"video_url": "xxx",　　　　//视频链接Id (ObjectId)
		"cover": {
			"cover_url":"xxx"    //视频截图链接 (String)
		},
		"view_number": 0,    //观看人数 (Number)
		"like_number": 0,    //喜欢人数 (Number)
		"comment_number": 0    //评论人数 (Number)
	},
},{...}
```
> ### 清除播放历史
```js
DELETE    http://localhost:3333/user/history/all/del?token=${token}
```
=> 'your history has been deleted'

## 我喜欢的
> ### 添加喜欢的视频
```js
POST    http://localhost:3333/user/favorite?vid=${vid}&token=${token}
```
// vid为视频Id, 多post一次即取消喜欢的视频   
=> 我的信息

> ### 获取我喜欢的
```js
GET    http://localhost:3333/user/favorite/get?token=${token}
```
=> 我的信息

## 关注及粉丝
```js
POST    http://localhost:3333/user/fan/:id?token=${token}
```
// id 为被关注人的 Id，会增加到 follows 中   
// 被关注的人 fans 会增加关注人的 Id    
=> 我的信息

## 搜索 
> ### 名字
```js
GET    http://localhost:3333/search/info?q=${q}
```
// q 为查询输入的值    
=> 个人信息   

> ### video标题
```js
GET    http://localhost:3333/search/video?q=${q}
```
=> 视频信息     

## 消息
> ### 获取消息
```js
GET    http://localhost:3333/user/message?token=${token}
```
// kinds 有三种情况，1为关注消息，2为赞视频消息(注：不是点赞评论)，3为评论消息      
=> 返回   
```js
{
	"_id": "xxx",　　　　　     //消息Id
	"ownerId": "xxx",      //本人Id
	"anotherId": {         //该部分为关注人或点赞视频/评论的人的信息
		"_id": "xxx",      //他人的Id
		"nickname": "xxx",
		"thumbnail": null,
		"head_pic": null,
		"fans": [],
		"follows": [],
		"pub_videos": []
	},
	"videoId": {           //视频信息
		"_id": "xxx",　　　　　　//视频Id
		"poster": "xxx",
		"title": "xxx",
		"video_url": {
			"_id": "xxx",
			"vid_url": "xxx"
		},
		"cover": {
			"_id": "xxx",
			"cover_url": "xxx"
		},
		"channel": "xxx",
		"view_number": 0,
		"like_number": 0,
		"comments": []
	},
	"commentId": {　　　　　　　　　
		"_id": "xxx",　　　　　　//评论Id
		"remark": "xxx"　　　　//评论内容
	},
	"kinds": 3,            //种类
	"createTime": "2017-01-05T03:48:00.522Z"　　　　//消息时间
}, {...}
```
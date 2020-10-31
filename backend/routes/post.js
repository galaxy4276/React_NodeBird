import { isLoggedIn, isNotLoggedIn } from './middlewares';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { hash } from 'bcrypt';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';


const router = require('express').Router();
const { Post, Comment, Image, User, Hashtag } = require('../models');



// try {
//   fs.accessSync('/uploads');
// } catch (err) {
//   console.log('uploads 폴더가 없으므로 생성합니다.');
//   fs.mkdirSync('uploads');
// }

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});
/*
multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) { // 은기초.png
      const ext = path.extname(file.originalname); // 확장자 추출(.png)
      const basename = path.basename(file.originalname); // 은기초
      done(null, basename + '_' + new Date().getTime() + ext); // 은기초123139123.png
    },
  }),
*/
const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(), // s3 권한을 얻은 것
    bucket: 'galaxyhi4276-react-nodebird',
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`);
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

router.post('/', upload.none(), async (req, res, next) => {
  const { content } = req.body;
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content,
      UserId: req.user.id,
    });

    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() }
      }))); // [[노드, true], [리액트, true]] 즉 배열에서 첫 번째 값만
      await post.addHashtags(result.map((v) => v[0]));
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) { // 이미지를 여러 개 올리면 image: [1.png, 2.png]
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await post.addImages(images);
      } else { // 이미지를 하나만 올리면 image: 1.png ( none array )
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Image,
      }, {
        model: Comment, // 댓글
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: User, // 유저
        attributes: ['id', 'nickname'],
      }, {
        model: User, // 좋아요
        as: 'Likers',
        attributes: ['id'],
      }]
    });
    return res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});


router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => { // POST /post/images
  console.log(req.files); // 업로드된 이미지의 정보가 들어있다.
  res.json(req.files.map((v) => v.location));
  
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  const { content, userId } = req.body;
  const { postId } = req.params;
  console.log(`userId: ${userId}`);
  console.log(`postId: ${postId}`);
  try {
    const post = await Post.findOne({
      where: {id: postId }
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    const comment = await Comment.create({
      content,
      PostId: parseInt(postId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }],
    });
    console.log('fullComment');
    console.log(fullComment);
    console.log('Comment User Info');
    console.log(fullComment.User);
    return res.status(201).json(fullComment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});


router.get('/:postId', async (req, res, next) => { // GET /post/1 
  try {
    console.log(`postId: ${req.params.postId}`);
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      res.status(404).send('존재하지 않는 게시글입니다.');
    }
    
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }, {
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }]
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id', 'nickname'],
      }],
    });
    console.log(fullPost);
    return res.status(200).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [{
        model: Post,
        as: 'Retweet'
      }],
    });

    if (!post) {
      res.status(403).send('존재하지 않는 게시글입니다.');
    }

    if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send('자신의 글을 리트윗 할 수 없습니다.');
    }
    
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    }); // 이미 리트윗 한 걸 막는다.
x
    if (exPost) {
      return status(403).send('이미 리트윗 하셨습니다.');
    }
    
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    });

    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [{
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }, {
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }]
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }],
    });
    return res.status(201).json(retweetWithPrevPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findOne({ where: { id: postId }});
    if (!post) {
      return res.status(404).send('게시글이 존재하지 않습니다.');
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete('/:postId/unlike', isLoggedIn, async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findOne({ where: { id: postId }});
    if (!post) {
      return res.status(404).send('게시글이 존재하지 않습니다.');
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete('/:postId',  isLoggedIn, async (req, res, next) => {
 try {
   const { postId } = req.params;
   await Post.destroy({
     where: { 
        id: postId,
        UserId: req.user.id,
      },
   });
   res.json({ PostId: parseInt(postId) });
 } catch (err) {
  console.error(err);
  next(err);
 }
});


export default router;  
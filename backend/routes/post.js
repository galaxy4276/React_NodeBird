import { isLoggedIn, isNotLoggedIn } from './middlewares';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { hash } from 'bcrypt';


const router = require('express').Router();
const { Post, Comment, Image, User } = require('../models');



// try {
//   fs.accessSync('/uploads');
// } catch (err) {
//   console.log('uploads 폴더가 없으므로 생성합니다.');
//   fs.mkdirSync('uploads');
// }

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) { // 은기초.png
      const ext = path.extname(file.originalname); // 확장자 추출(.png)
      const basename = path.basename(file.originalname); // 은기초
      done(null, basename + '_' + new Date().getTime() + ext); // 은기초123139123.png
    },
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
      await Promise.all(hashtags.map((tag) => hashtags.create({ name: tag.slice(1).toLowerCase() })));
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
  res.json(req.files.map((v) => v.filename));
  
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
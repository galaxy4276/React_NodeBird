import { isLoggedIn, isNotLoggedIn } from './middlewares';

const router = require('express').Router();
const { Post, Comment, Image, User } = require('../models');


router.post('/', async (req, res, next) => {
  const { content } = req.body;
  try {
    const post = await Post.create({
      content,
      UserId: req.user.id,
    });

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
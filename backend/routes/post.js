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
        model: Comment,
      }, {
        model: User
      }]
    });
    return res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/:postId/comment', async (req, res, next) => {
  const { content, userId } = req.body;
  const { postId } = req.params;
  try {
    const post = await Post.findOne({
      where: {id: postId }
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    const comment = await Comment.create({
      content,
      postId,
      userId,
    });
    return res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});



export default router;
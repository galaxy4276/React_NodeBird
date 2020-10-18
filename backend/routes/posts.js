const router = require('express').Router();
const { Post, User, Image, Comment } = require('../models');


router.get('/', async (req, res, next) => {
  console.log('posts load');
  try {
    const posts = await Post.findAll({
      // where: { id: lastId },
      limit: 10,
      //offset: 0, // 1 ~ 10 까지 10개 가져와~ 10일경우 11 ~ 20
      order: [
        ['createdAt', 'DESC'], 
        [Comment, 'createdAt', 'DESC'],
      ], // 최신게시글부터 가져온다.
      include: [{
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
        model: User, // 좋아요
        as: 'Likers',
        attributes: ['id'],
      }],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});


export default router;
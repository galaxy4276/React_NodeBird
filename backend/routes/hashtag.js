const router = require('express').Router();
import { Op } from 'sequelize';

const { User, Hashtag, Image, Comment, Post } = require('../models');


router.get('/:hashtag', async (req, res, next) => { // GET /hashtag/~
  try {

    const where = {};

    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10)};
    } // lastId보다 작은거 10개불러오기

    const posts = await Post.findAll({
      where,
      // where: { id: lastId },
      limit: 10,
      //offset: 0, // 1 ~ 10 까지 10개 가져와~ 10일경우 11 ~ 20
      order: [
        ['createdAt', 'DESC'], 
        [Comment, 'createdAt', 'DESC'],
      ], // 최신게시글부터 가져온다.
      include: [{
        model: Hashtag,
        where: { name: decodeURIComponent(req.params.hashtag) },
      },{
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
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      },],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});


export default router;
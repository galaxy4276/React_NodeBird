import bcrypt from 'bcrypt';
import passport from 'passport';
import { Op } from 'sequelize';
import { isLoggedIn, isNotLoggedIn } from './middlewares';

const router = require('express').Router();
const { User, Post, Comment, Image } = require('../models');


router.get('/', async (req, res, next) => {
  console.log(req.headers); // 여기 안에 쿠키가 들어있다.
  try {
    if (req.user) {
      console.log('getUser req.user.id: ', req.user.id);
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password'],
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          attributes: ['id'],
          as: 'Followings',
        }, {
          model: User,
          attributes: ['id'],
          as: 'Followers',
        }]
      });
      
    
      res.status(200).json(user);
    } else {
      res.status(200).json(null);
    }
  } catch(err) {
    console.log('LOAD_MY_INFO ERROR');
    console.error(err);
    next(err);
  }
});



router.get('/:userId', async (req, res, next) => { // GET /user/1
  console.log(req.headers); // 여기 안에 쿠키가 들어있다.
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ['password'],
      },
      include: [{
        model: Post,
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followings',
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id'],
      }]
    });

    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      // sequelize에서 보내주는 데이터는 json 이 아니다.
      data.Posts = data.Posts.length; // 개인정보 침해 예방
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(404).send('존재하지 않는 사용자입니다.');
    }
  } catch(err) {
    console.log('LOAD_USER ERROR');
    console.error(err);
    next(err);
  }
});


router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log('authenticate err');
      console.error(err);
      return next(err);
    }

    if (info) {
      console.log('authenticate info error');
      console.log(info);
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.log('authenticate req.login(callback:= loginErr)');
        console.error(loginErr);
        return next(loginErr);
      }
      // res.setHeader('Cookie', 'cxlhy');
      console.log(`user.id: ${user.id}`);
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ['password'],
        },
        include: [{
          model: Post,
        }, {
          model: User,
          as: 'Followings',
        }, {
          model: User,
          as: 'Followers',
        }]
      }); // 테이블 관계를 자동으로 합쳐서 반환한다.
      console.log('req.user');
      console.log(req.user);
      console.log(req.session);
      return res.json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post('/logout', (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});

router.post('/', async (req, res, next) => { // POST /user/
  const { email, nickname, password } = req.body; 
  console.log(`email:${email}\nnickname:${nickname}\npassword:${password}`);
  try {
    const exUser = await User.findOne({
      where: {
        email
      }
    });
    console.log(exUser);

    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.'); 
    }

    const hash = await bcrypt.hash(password, 12);
  
    await User.create({
      email,
      nickname,
      password: hash,
    });

    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060');
    return res.status(200).send('ok');
  } catch(err) {
    console.error(err);
    next(err);
  }
});

router.get('/:userId/posts', async (req, res, next) => {
  try {

    const where = { UserId: req.params.userId };

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


router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  console.log('patch nickname');
  try {
    if (req.body.nickname) {
      await User.update({
        nickname: req.body.nickname,
      }, {
        where: { id: req.user.id }
      });
      return res.status(200).json({ nickname: req.body.nickname });
    } 
    res.status(401).json('req.body.nickname이 확인되지 않았습니다.');
  } catch (err) {
    console.error(err);
    next(err);
  }
})

router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => { // PATCH /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId }});
    if (!user) {
      return res.status(403).send('유령을 팔로우하려고 하시네요?');
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId }});
    if (!user) {
      return res.status(403).send('유령을 언팔로우하려고 하시네요?');
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => { // DELETE /user.follower/2
  try {
    const user = await User.findOne({ where: { id: req.user.id }});
    if (!user) {
      return res.status(403).send('유령을 차단하려고 하시네요?');
    }
    await user.removeFollowers(req.params.userId);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/followers', isLoggedIn, async (req, res, next) => { // GET /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id }});
    if (!user) {
      return res.status(403).send('유령을 팔로우하려고 하시네요?');
    }
    const followers = await user.getFollowers();
    res.status(200).json(followers);
  } catch (err) {
    console.error(err);
    next(err);
  }
});


router.get('/followings', isLoggedIn, async (req, res, next) => { // GET /user/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id }});
    if (!user) {
      return res.status(403).send('유령을 팔로우하려고 하시네요?');
    }
    const followings = await user.getFollowings();
    res.status(200).json(followings);
  } catch (err) {
    console.error(err);
    next(err);
  }
});





export default router;
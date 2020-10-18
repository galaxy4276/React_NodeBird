import bcrypt from 'bcrypt';
import passport from 'passport';
import { isLoggedIn, isNotLoggedIn } from './middlewares';

const router = require('express').Router();
const { User, Post } = require('../models');


router.get('/', async (req, res, next) => {
  console.log('load user');
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
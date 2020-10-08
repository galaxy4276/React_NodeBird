import bcrypt from 'bcrypt';
import passport from 'passport';

const router = require('express').Router();
const { User, Post } = require('../models');


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
  try {
    const exUser = await User.findOne({
      where: {
        email
      }
    });

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


export default router;
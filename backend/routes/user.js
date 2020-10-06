import bcrypt from 'bcrypt';
import { nextTick } from 'process';

const router = require('express').Router();
const { User } = require('../models');


router.post('/', async (req, res, next) => { // POST /user/
  console.log(req.body);
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
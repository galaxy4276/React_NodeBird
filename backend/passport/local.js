import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
const { User } = require('../models');

export default (() => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({
        where: { email }
      });
      if (!user) {
        done(null, false, { reason: '존재하지 않는 사용자입니다!' });
      } 
  
      const pwVerify = await bcrypt.compare(password, user.password);
  
      if (pwVerify) {
        console.log('비밀번호가 일치하니 로그인을 수행합니다.');
        return done(null, user);
      }
      return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
    } catch (err) {
      console.error(err);
      return done(err);
    }
  }));
});
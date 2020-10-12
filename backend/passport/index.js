import passport from 'passport';
import local from './local';
const { User } = require('../models');

export default () => {
  passport.serializeUser((user, done) => { // req.login 의 정보가 들어감
    console.log('serializeUser');
    console.log(user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => { // 유저 정보 복원, 그 다음 요청부터 수행
    // 매번 실행, 아이디로 부터 사용자 정보를 복구
    console.log('deserializeUser');
    console.log(`id: ${id}`);
    try {
      const user = await User.findOne({ where: { id }});
      console.log('user await done!');
      done(null, user); // 정보를 복구해서 req.user 안에 넣어준다. 
    } catch (err) {
      console.log('deserializeUser Error');
      console.error(err);
      done(err);
    }
  });

  local();
};
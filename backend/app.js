import express from 'express';
import logger from 'morgan';
import db from './models';
import postRouter from './routes/post';
import userRouter from './routes/user';
import cors from 'cors';


const app = express();
db.sequelize.sync()
  .then(() => {
    console.log('디비 연결 성공');
  })
  .catch(console.error);


app.use(cors({
  origin: '*',
  credentials: false,
})); // *origin -> 허용 도메인 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('<h1>Hello</h1>');
});

app.get('/posts', (req, res) => {
  res.json([
    { id: 1, content: 'hello', },
    { id: 2, content: 'melong', },
    { id: 3, content: 'babo', },
  ]);
});


app.use('/post', postRouter);
app.use('/user', userRouter);


app.listen(3065, () => {
  console.log('server running on 3065 PORT');
});
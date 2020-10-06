import express from 'express';
import logger from 'morgan';

import postRouter from './routes/post';

const app = express();


app.use(logger('dev'));

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


app.listen(3065, () => {
  console.log('server running on 3065 PORT');
});
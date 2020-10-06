const router = require('express').Router();


router.post('/', (req, res) => {
  res.json([
    { id: 1, content: 'hello', },
    { id: 2, content: 'melong', },
    { id: 3, content: 'babo', },
  ]);
});

router.delete('/', (req, res) => {
  res.json({ id: 1 });
});


export default router;
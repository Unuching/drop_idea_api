import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const ideas = [
    { id: 1, title: 'Idea 1', description: 'This is an Idea 1' },
    { id: 2, title: 'Idea 2', description: 'This is an Idea 2' },
    { id: 3, title: 'Idea 3', description: 'This is an Idea 3' },
  ];

  res.json(ideas);
});

router.post('/', (req, res) => {
  const { title, description } = req.body;
  console.log(description);

  res.send(title);
});

export default router;

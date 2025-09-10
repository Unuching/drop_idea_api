import express from 'express';

const router = express.Router();

// @route             GET  /api/ideas
// @description       get all ideas
//@access             public

router.get('/', (req, res) => {
  const ideas = [
    { id: 1, title: 'Idea 1', description: 'This is an Idea 1' },
    { id: 2, title: 'Idea 2', description: 'This is an Idea 2' },
    { id: 3, title: 'Idea 3', description: 'This is an Idea 3' },
  ];

  res.status(400);
  throw new Error('Ok my bad sorry');

  res.json(ideas);
});

// @route             POST  /api/ideas
// @description       create new idea
//@access             public

router.post('/', (req, res) => {
  const { title, description } = req.body;
  console.log(description);

  res.send(title);
});

export default router;

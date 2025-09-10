import express from 'express';
import Idea from '../models/Idea.js';
import mongoose from 'mongoose';

const router = express.Router();

// @route             GET  /api/ideas
// @description       get all ideas
//@access             public

router.get('/', async (req, res, next) => {
  try {
    const ideas = await Idea.find();
    res.json(ideas);
  } catch (err) {
    console.log(err);

    next(err);
  }
});
// @route             GET  /api/ideas/:id
// @description       get one idea
//@access             public

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Idea not found');
    }

    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      res.status(404);
      throw new Error('Idea not found');
    }
    res.json(idea);
  } catch (err) {
    console.log(err);

    next(err);
  }
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

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

    const idea = await Idea.findById(id);
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

router.post('/', async (req, res, next) => {
  try {
    const { title, summary, description, tags } = req.body;
    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error('Title, summary and description required.');
    }

    const newIdea = new Idea({
      title,
      summary,
      description,
      tags:
        typeof tags === 'string'
          ? tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray(tags)
          ? tags
          : [],
    });
    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (err) {
    console.log(err);

    next(err);
  }
});

// @route             DELETE  /api/ideas/:id
// @description       delete idea
//@access             public

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Idea not found');
    }

    const idea = await Idea.findByIdAndDelete(id);
    if (!idea) {
      res.status(404);
      throw new Error('Idea not found');
    }
    res.json({ message: 'Idea deleted successfully' });
  } catch (err) {
    console.log(err);

    next(err);
  }
});

// @route             PUT  /api/ideas/:id
// @description       update idea
//@access             public
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Idea not found');
    }
    const { title, summary, description, tags } = req.body;
    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error('Title, summary and description required.');
    }
    const updatedIdea = await Idea.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        description,
        tags: Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim()),
      },
      { new: true, runValidators: true }
    );
    if (!updatedIdea) {
      res.status(404);
      throw new Error('Idea not found');
    }
    res.json(updatedIdea);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default router;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/ideas', (req, res) => {
  const ideas = [
    { id: 1, title: 'Idea 1', description: 'This is an Idea 1' },
    { id: 2, title: 'Idea 2', description: 'This is an Idea 2' },
    { id: 3, title: 'Idea 3', description: 'This is an Idea 3' },
  ];

  res.json(ideas);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

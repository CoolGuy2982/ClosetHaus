import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
// Increase payload limit for base64 images
app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api', apiRoutes);

// --- Static Frontend Serving ---

// Get the absolute path to the frontend's build directory
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

// Serve static files from the React build folder
app.use(express.static(frontendDistPath));

// For any other route, serve the frontend's index.html
// This is crucial for client-side routing (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// --- Server Start ---

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
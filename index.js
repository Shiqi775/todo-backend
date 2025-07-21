// main Express server
const express = require('express');       // Import Express framework
const cors = require('cors');             // Middleware to allow cross-origin requests
const app = express();                    // Create an Express app
const todosRouter = require('./routes/todos');  // Import todos routes

app.use(cors());                          // Enable CORS (for frontend to call backend)
app.use(express.json());                  // Enable parsing of JSON bodies

app.use('/todos', todosRouter);           // All /todos requests handled by todosRouter

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

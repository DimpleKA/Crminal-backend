const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db');
const Criminal = require('./models/Criminals'); // Your MongoDB Criminal model

const app = express();
const port = 3000;

connectDB(); // Connect to MongoDB

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (adjust for production)
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json()); // Parse JSON bodies

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial criminal data when a new client connects
  socket.on('requestInitialData', async () => {
    try {
      const criminals = await Criminal.find(); // Fetch all criminals from the database
      socket.emit('initialData', criminals);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  });

  // Listen for location updates from the client
  socket.on('updateLocation', async (data) => {
    try {
      // Find the criminal by IP and update their location
      const updatedCriminal = await Criminal.findOneAndUpdate(
        { ip: data.ip }, // Locate criminal by their IP
        { latitude: data.latitude, longitude: data.longitude }, // Update location
        { new: true, upsert: true } // Create a new entry if it doesn't exist
      );

      // Broadcast the updated location to all connected clients
      io.emit('locationUpdated', updatedCriminal);
      console.log('Location updated for:', updatedCriminal);
    } catch (error) {
      console.error('Error updating location:', error.message);
    }
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

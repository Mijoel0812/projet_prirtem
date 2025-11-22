import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './src/routes/authRoutes.js';
import vehicleRoutes from './src/routes/vehicleRoutes.js';
import driverRoutes from './src/routes/driverRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';


const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Autoriser les requêtes depuis votre frontend React
app.use(express.json()); // Analyser le JSON des requêtes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/profiles', profileRoutes);
// Route de test
app.get('/', (req, res) => {
  res.send('API PRIRTEM en cours d\'exécution...');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
 

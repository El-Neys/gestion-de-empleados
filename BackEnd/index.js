
import 'dotenv/config';
import express from 'express';
import { conectarDB } from './database.js';
import empleadoRoutes from './routes/empleado.routes.js';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/empleados', empleadoRoutes);

app.get('/', (req, res) => {
  res.send('API de Gestión de Empleados funcionando correctamente');
});

async function iniciarServidor() {
  await conectarDB();

  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

iniciarServidor();

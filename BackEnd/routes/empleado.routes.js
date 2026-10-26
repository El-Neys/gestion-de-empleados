import { Router } from 'express';

import {
  obtenerEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado
} from '../controllers/empleado.controller.js';

const router = Router();

// Consultar todos los empleados
router.get('/', obtenerEmpleados);

// Consultar un empleado por su ID
router.get('/:id', obtenerEmpleado);

// Crear un empleado
router.post('/', crearEmpleado);

// Actualizar un empleado
router.put('/:id', actualizarEmpleado);

// Eliminar un empleado
router.delete('/:id', eliminarEmpleado);

export default router;
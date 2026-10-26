
import mongoose from 'mongoose';

const empleadoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    posicion: {
      type: String,
      required: true,
      trim: true
    },
    oficina: {
      type: String,
      required: true,
      trim: true
    },
    salario: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model('Empleado', empleadoSchema);

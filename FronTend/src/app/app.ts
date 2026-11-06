import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  EmpleadoService,
  Empleado
} from './services/empleado';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private empleadoService = inject(EmpleadoService);
  private cdr = inject(ChangeDetectorRef);

  empleados: Empleado[] = [];

  nombre = '';
  posicion = '';
  oficina = '';
  salario: number | null = null;

  empleadoEditando: string | null = null;
  cargando = true;
  guardando = false;
  eliminandoId: string | null = null;
  error = '';
  errorCarga = '';
  mensaje = '';

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.cargando = true;
    this.errorCarga = '';
    this.cdr.markForCheck();

    this.empleadoService.obtenerEmpleados().subscribe({
      next: (datos) => {
        console.log('Empleados recibidos:', datos);
        this.empleados = [...datos];
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar empleados:', err);
        this.errorCarga =
          err.error?.mensaje || 'No se pudieron cargar los empleados.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  registrarEmpleado(): void {
    this.error = '';
    this.mensaje = '';

    if (
      !this.nombre.trim() ||
      !this.posicion.trim() ||
      !this.oficina.trim() ||
      this.salario === null ||
      !Number.isFinite(Number(this.salario)) ||
      Number(this.salario) < 0
    ) {
      this.error = 'Completa todos los campos correctamente.';
      this.cdr.markForCheck();
      return;
    }

    const datos: Empleado = {
      nombre: this.nombre.trim(),
      posicion: this.posicion.trim(),
      oficina: this.oficina.trim(),
      salario: Number(this.salario)
    };

    this.guardando = true;
    this.cdr.markForCheck();

    const peticion = this.empleadoEditando
      ? this.empleadoService.actualizarEmpleado(
          this.empleadoEditando,
          datos
        )
      : this.empleadoService.crearEmpleado(datos);

    peticion.subscribe({
      next: (empleadoGuardado) => {
        console.log('Guardado:', empleadoGuardado);
        const idEditado = this.empleadoEditando;
        const estabaEditando = idEditado !== null;

        if (idEditado) {
          const index = this.empleados.findIndex(
            (empleado) => empleado._id === idEditado
          );
          if (index >= 0) {
            this.empleados = this.empleados.map((empleado) =>
              empleado._id === idEditado ? empleadoGuardado : empleado
            );
          } else {
            this.empleados = [...this.empleados, empleadoGuardado];
          }
        } else {
          this.empleados = [...this.empleados, empleadoGuardado];
        }

        this.limpiarFormulario();
        this.mensaje = estabaEditando
          ? 'Empleado actualizado correctamente.'
          : 'Empleado registrado correctamente.';
        this.guardando = false;
        this.cdr.markForCheck();
        this.cargarEmpleados();
      },
      error: (err) => {
        console.error('Error al guardar empleado:', err);
        this.error =
          err.error?.mensaje || 'No se pudo guardar el empleado.';
        this.guardando = false;
        this.cdr.markForCheck();
      }
    });
  }

  editarEmpleado(empleado: Empleado): void {
    if (!empleado._id) {
      this.error = 'El empleado no tiene un ID válido.';
      this.cdr.markForCheck();
      return;
    }

    this.nombre = empleado.nombre;
    this.posicion = empleado.posicion;
    this.oficina = empleado.oficina;
    this.salario = empleado.salario;
    this.empleadoEditando = empleado._id;
    this.mensaje = '';
    this.error = '';
    this.cdr.markForCheck();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarEmpleado(empleado: Empleado): void {
    if (!empleado._id) {
      this.error = 'El empleado no tiene un ID válido.';
      this.cdr.markForCheck();
      return;
    }

    const confirmar = window.confirm(
      `¿Deseas eliminar a ${empleado.nombre}?`
    );

    if (!confirmar) {
      return;
    }

    this.error = '';
    this.mensaje = '';

    this.eliminandoId = empleado._id;
    this.cdr.markForCheck();

    this.empleadoService.eliminarEmpleado(empleado._id).subscribe({
      next: () => {
        this.eliminandoId = null;
        this.empleados = this.empleados.filter(
          (registro) => registro._id !== empleado._id
        );
        if (this.empleadoEditando === empleado._id) {
          this.limpiarFormulario();
        }
        this.mensaje = 'Empleado eliminado correctamente.';
        this.cdr.markForCheck();
        this.cargarEmpleados();
      },
      error: (err) => {
        console.error('Error al eliminar empleado:', err);
        this.eliminandoId = null;
        this.error =
          err.error?.mensaje || 'No se pudo eliminar el empleado.';
        this.cdr.markForCheck();
      }
    });
  }

  limpiarFormulario(): void {
    this.nombre = '';
    this.posicion = '';
    this.oficina = '';
    this.salario = null;
    this.empleadoEditando = null;
    this.error = '';
    this.mensaje = '';
    this.cdr.markForCheck();
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Empleado {
  _id?: string;
  nombre: string;
  posicion: string;
  oficina: string;
  salario: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/empleados';

  obtenerEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl);
  }

  crearEmpleado(datos: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, datos);
  }

  actualizarEmpleado(id: string, datos: Empleado): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.apiUrl}/${id}`, datos);
  }

  eliminarEmpleado(id: string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/${id}`
    );
  }
}

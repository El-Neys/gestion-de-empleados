import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Empleado, EmpleadoService } from './empleado';

describe('EmpleadoService', () => {
  let service: EmpleadoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(EmpleadoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve employees', () => {
    const empleados: Empleado[] = [{
      nombre: 'Laura Pérez',
      posicion: 'Administradora',
      oficina: 'Principal',
      salario: 2500000
    }];

    service.obtenerEmpleados().subscribe((resultado) => {
      expect(resultado).toEqual(empleados);
    });

    const request = httpTestingController.expectOne('http://localhost:3000/api/empleados');
    expect(request.request.method).toBe('GET');
    request.flush(empleados);
  });

  it('should create an employee', () => {
    const empleado: Empleado = {
      nombre: 'Laura Pérez',
      posicion: 'Administradora',
      oficina: 'Principal',
      salario: 2500000
    };

    service.crearEmpleado(empleado).subscribe((resultado) => {
      expect(resultado).toEqual(empleado);
    });

    const request = httpTestingController.expectOne('http://localhost:3000/api/empleados');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(empleado);
    request.flush(empleado);
  });
});

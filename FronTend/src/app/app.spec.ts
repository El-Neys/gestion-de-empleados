import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { App } from './app';
import { Empleado, EmpleadoService } from './services/empleado';

describe('App', () => {
  let respuestaCarga: Subject<Empleado[]>;

  beforeEach(async () => {
    respuestaCarga = new Subject<Empleado[]>();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: EmpleadoService,
          useValue: {
            obtenerEmpleados: () => respuestaCarga.asObservable(),
            crearEmpleado: () => of({}),
            actualizarEmpleado: () => of({}),
            eliminarEmpleado: () => of({ mensaje: 'Empleado eliminado correctamente' })
          }
        }
      ]
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    respuestaCarga.next([]);
    respuestaCarga.complete();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Gestión de Empleados');
  });

  it('should show loading while employees are being fetched', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.componentInstance.cargando).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Cargando empleados...');
  });

  it('should display a fetch error and allow retrying', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    respuestaCarga.error({ error: { mensaje: 'Error del servidor' } });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.cargando).toBe(false);
    expect(fixture.componentInstance.errorCarga).toBe('Error del servidor');
    expect(fixture.nativeElement.textContent).toContain('Error del servidor');
    expect(fixture.nativeElement.textContent).toContain('Reintentar');
    expect(fixture.nativeElement.textContent).not.toContain('Todavía no hay empleados');

    respuestaCarga = new Subject<Empleado[]>();
    (fixture.nativeElement.querySelector('.mensaje-error button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.cargando).toBe(true);
    expect(fixture.componentInstance.errorCarga).toBe('');
  });
});

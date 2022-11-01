import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ICurso } from '../../interfaces/curso.interface';
import { AuthService } from '../../services/auth.service';
import { CursoService } from '../../services/curso.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {

  @ViewChild('closebutton') closeButton: ElementRef;
  form: FormGroup;
  courses: ICurso[] = [];
  subs: Subscription[] = [];
  modalTitle: string = '';

  constructor(
    public AuthService: AuthService,
    private CursoService: CursoService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  ) {
    this.setForm(null);
    this.getCourses();
  }

  ngOnInit() {
  }

  private setForm(entity: ICurso | null) {
    this.form = this.formBuilder.group({
      id: [entity?.id || undefined],
      name: [entity?.name || "", [Validators.required]],
      description: [entity?.description || ""],
    });
  }

  getCourses() {
    this.AuthService.isLoadingSubject.next(true);
    const getCourseSub = this.CursoService.getAllCourses().subscribe({
      next: (value: ICurso[]) => {
        this.courses = value;
        this.AuthService.isLoadingSubject.next(false);
      }, error: (err: HttpErrorResponse) => {
        this.AuthService.isLoadingSubject.next(false);
        this.toastr.error(err.message, "ERROR");
      }
    })
    this.subs.push(getCourseSub);
  }


  submited() {
    if (!this.form.valid) {
      this.form.markAllAsTouched()
      this.toastr.error('Verifica la información ingresada antes de continuar', 'Error');
      return;
    }
    const curso = this.form.value as ICurso;
    this.AuthService.isLoadingSubject.next(true);
    if (curso.id === null) {
      const postUsersSub = this.CursoService.createCourse(curso).subscribe({
        next: (value: ICurso) => {
          setTimeout(() => {
            this.toastr.success("Usuario creado", "Success");
            this.AuthService.isLoadingSubject.next(false);
            this.closeButton.nativeElement.click();
            this.getCourses();
          }, 800);
        }, error: (err: HttpErrorResponse) => {
          this.AuthService.isLoadingSubject.next(false);
          this.toastr.error(err.message, "ERROR");
        }
      });
      this.subs.push(postUsersSub)
    } else if (curso.id !== undefined) {
      const putUsersSub = this.CursoService.updateCourse(curso).subscribe({
        next: (value: ICurso) => {
          setTimeout(() => {
            this.toastr.success("Usuario actualizado", "Success");
            this.AuthService.isLoadingSubject.next(false);
            this.closeButton.nativeElement.click();
            this.getCourses();
          }, 800);
        }, error: (err: HttpErrorResponse) => {
          this.AuthService.isLoadingSubject.next(false);
          this.toastr.error(err.message, "ERROR");
        }
      });
      this.subs.push(putUsersSub)
    } else
      this.toastr.warning("Varifique la información seleccionada o información nueva, ingresada en el formulario")
  }

  showModal(curso: ICurso | null) {
    if (!curso) {
      this.modalTitle = 'Nuevo Curso';
      this.setForm(null);
    }
    else {
      this.modalTitle = 'Actualizar Curso'
      this.setForm(curso);
    }
  }

  deleteCourse(id: string) {
    if (!id)
      return;
    Swal.fire({
      title: 'Warning',
      text: `¿Esta seguro que desea eliminar este curso?`,
      icon: 'warning',
      showCloseButton: true,
      focusConfirm: true,
      showCancelButton: true,
      confirmButtonColor: '#4ba1ff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const subcriptDelete = this.CursoService.deleteCourse(id).subscribe({
          next: (response: any) => {
            this.toastr.success("Usuario eliminado", "Success")
            this.getCourses();
          },
          error: (err: HttpErrorResponse) => {
            this.toastr.error(err.error?.message || "An unexpected error occurred, please try again later", "Error")
          },
        })
        this.subs.push(subcriptDelete)
      }
    });

  }

  ngOnDestroy() {
    if (this.subs.length > 0)
      this.subs.forEach(x => x.unsubscribe());
  }
}

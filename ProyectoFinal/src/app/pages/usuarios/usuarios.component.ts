import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  @ViewChild('closebutton') closeButton: ElementRef;
  form: FormGroup;
  users: IUser[] = [];
  subs: Subscription[] = [];
  modalTitle: string = '';

  constructor(
    public AuthService: AuthService,
    private UserService: UserService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  ) {
    this.setForm(null);
    this.getUsers();
  }

  ngOnInit() {
  }

  private setForm(entity: IUser | null) {
    this.form = this.formBuilder.group({
      id: [entity?.id || undefined],
      name: [entity?.name || "", [Validators.required]],
      lastName: [entity?.lastName || ""],
      email: [entity?.email || "", [Validators.required, Validators.email]],
      password: [entity?.password || "", [Validators.required]],
      rePassword: [entity?.password || "", [Validators.required]],
    }, {
      validator: this.MustMatch("password", "rePassword"),
    });
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const firstControl = formGroup.controls[controlName];
      const matchControl = formGroup.controls[matchingControlName]
      if (matchControl.errors && !matchControl.errors['MustMatch'])
        return;
      if (firstControl.value !== matchControl.value) {
        matchControl.setErrors({ MustMatch: true })
      } else {
        matchControl.setErrors(null)
      }
    }
  }

  /*
    Obteniendo todos los usuario de la base de datos
    el isLoadingSubject se declaro por si se agrega un loading a la pagina
  */
  async getUsers() {
    this.AuthService.isLoadingSubject.next(true);
    const getUsersSub = this.UserService.getAllUsers().subscribe({
      next: (value: IUser[]) => {
        this.users = value;
        this.AuthService.isLoadingSubject.next(false);
      }, error: (err: HttpErrorResponse) => {
        this.AuthService.isLoadingSubject.next(false);
        this.toastr.error(err.message, "ERROR");
      }
    })
  }

  submited() {
    if (!this.form.valid) {
      this.form.markAllAsTouched()
      this.toastr.error('Verifica la información ingresada antes de continuar', 'Error');
      return;
    }
    const user = this.form.value as IUser;
    this.AuthService.isLoadingSubject.next(true);
    if (user.id === null) {
      const postUsersSub = this.UserService.createUser(user).subscribe({
        next: (value: IUser) => {
          setTimeout(() => {
            this.toastr.success("Usuario creado", "Success");
            this.AuthService.isLoadingSubject.next(false);
            this.closeButton.nativeElement.click();
            this.getUsers();
          }, 800);
        }, error: (err: HttpErrorResponse) => {
          this.AuthService.isLoadingSubject.next(false);
          this.toastr.error(err.message, "ERROR");
        }
      });
      this.subs.push(postUsersSub)
    } else if (user.id !== undefined) {
      const putUsersSub = this.UserService.updateUser(user).subscribe({
        next: (value: IUser) => {
          setTimeout(() => {
            this.toastr.success("Usuario actualizado", "Success");
            this.AuthService.isLoadingSubject.next(false);
            this.closeButton.nativeElement.click();
            this.getUsers();
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

  showModal(user: IUser | null) {
    if (!user) {
      this.modalTitle = 'Nuevo usuario';
      this.setForm(null);
    }
    else {
      this.modalTitle = 'Actualizar usuario'
      this.setForm(user);
    }
  }

  deleteUser(id: string) {
    if (!id)
      return;
    Swal.fire({
      title: 'Warning',
      text: `¿Esta seguro que desea eliminar este usuario?`,
      icon: 'warning',
      showCloseButton: true,
      focusConfirm: true,
      showCancelButton: true,
      confirmButtonColor: '#4ba1ff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const subcriptDelete = this.UserService.deleteUser(id).subscribe({
          next: (response: any) => {
            this.toastr.success("Usuario eliminado", "Success")
            this.getUsers();
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

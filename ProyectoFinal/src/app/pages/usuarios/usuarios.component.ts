import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  @ViewChild('modalImp', { static: true }) modal: ElementRef;
  form: FormGroup;
  users: IUser[] = [];
  subs: Subscription[] = [];
  modalTitle: string = '';

  // ModalOptions: NgbModalOptions = {
  //   size: "lg",
  //   backdrop: 'static'
  // }

  constructor(
    private AuthService: AuthService,
    private UserService: UserService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  ) {
    //this.setForm(null);
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
      password: [entity?.password || ""],
      rePassword: [entity?.rePassword || ""],
    }, {
    });
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
    if (user.id === undefined) {
      const postUsersSub = this.UserService.createUser(user).subscribe({
        next: (value: IUser[]) => {
          this.users = value;
          this.AuthService.isLoadingSubject.next(false);
        }, error: (err: HttpErrorResponse) => {
          this.AuthService.isLoadingSubject.next(false);
          this.toastr.error(err.message, "ERROR");
        }
      });
      this.subs.push(postUsersSub)
    } else if (user.id !== undefined) {
      const putUsersSub = this.UserService.updateUser(user).subscribe({
        next: (value: any) => {
          this.users = value;
          this.AuthService.isLoadingSubject.next(false);
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
    console.log(user);
    if (!user) {
      this.modalTitle = 'Nuevo usuario';
      this.setForm(null);
    }
    else {
      this.modalTitle = 'Actualizar usuario'
      this.setForm(user);
    }
    console.log(this.modal);
    this.modal.nativeElement.click();
    //this.modalService.open(content, this.ModalOptions);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICurso } from '../interfaces';

const API_USERS_URL = `${environment.apiUrl}/cursos`;
@Injectable({
  providedIn: 'root'
})
export class CursoService {

  constructor(
    private httpClient: HttpClient
  ) { }

  createCourse(curso: ICurso): Observable<any> {
    curso.id = Guid.create().toString();
    return this.httpClient.post<ICurso>(API_USERS_URL, curso);
  }

  deleteCourse(id: string) {
    return this.httpClient.delete<ICurso>(`${API_USERS_URL}/${id}`);
  }

  updateCourse(curso: ICurso) {
    return this.httpClient.put<ICurso>(`${API_USERS_URL}/${curso.id}`, curso);
  }

  getAllCourses(): Observable<ICurso[]> {
    return this.httpClient.get<ICurso[]>(API_USERS_URL);
  }
}

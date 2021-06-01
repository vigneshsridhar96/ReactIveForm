import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  postEmploye(data: any){
    return this.http.post<any>("http://localhost:3000/Employees", data)
  }

  getEmploye(){
    return this.http.get<any>("http://localhost:3000/Employees")
  }

  putEmploye(data: any, id: number){
    return this.http.put<any>("http://localhost:3000/Employees/"+id,data)
  }

  deleteEmploye(id: number){
    return this.http.delete<any>("http://localhost:3000/Employees/"+id)
  }
}

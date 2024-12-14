import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import type { LoginResponse } from "../types/loginResponse.type";
import { catchError, tap, throwError } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class LoginService {
  apiUrl = "http://localhost:8080/auth"

	constructor(private httpClient: HttpClient) {}

	login(login: string, password: string) {
		return this.httpClient
			.post<LoginResponse>(this.apiUrl + "/login", { login, password })
			.pipe(
				tap((value) => {
					sessionStorage.setItem("auth-token", value.token);
					sessionStorage.setItem("id", value.id.toString());
					sessionStorage.setItem("role", value.role);
				}),
        catchError((error) => {
          const errorMessage = error.error?.message ||
                             error.error?.error ||
                             error.message ||
                             'Erro ao realizar login';
          return throwError(() => errorMessage);
        })
			);
	}

  signup(name: string, login: string, password: string, role: string) {
		return this.httpClient
			.post(this.apiUrl + "/register", { name, login, role, password })
			.pipe(
        catchError((error) => {
          console.log(error);
          return throwError(error)
        })
			);
	}
}

import { Component } from "@angular/core";
import { LoginLayoutComponent } from "../../components/login-layout/login-layout.component";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";
import { ToastrService } from "ngx-toastr";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: "app-login",
	standalone: true,
	imports: [LoginLayoutComponent, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
	providers: [LoginService, ToastrService],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.scss",
})
export class LoginComponent {
	loginForm!: FormGroup;
	hidePassword = true;

	constructor(
		private router: Router,
		private loginService: LoginService,
		private toastService: ToastrService,
	) {
		this.loginForm = new FormGroup({
			login: new FormControl("", [Validators.required, Validators.email]),
			password: new FormControl("", [
				Validators.required,
				Validators.minLength(6),
			]),
		});
	}

	submit() {
		if (this.loginForm.valid) {
			this.loginService
				.login(this.loginForm.value.login, this.loginForm.value.password)
				.subscribe({
					next: () => {
						this.router.navigate(["/home"]);
						this.toastService.success("Sucesso ao logar");
					},
					error: () => {
						this.toastService.error("Email ou senha inválidos");
					},
				});
		} else {
			this.toastService.error("Por favor, preencha todos os campos corretamente");
		}
	}

	navigate() {
		this.router.navigate(["/signup"]);
	}
}

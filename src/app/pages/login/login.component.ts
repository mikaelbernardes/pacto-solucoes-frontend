import { Component } from "@angular/core";
import { LoginLayoutComponent } from "../../components/login-layout/login-layout.component";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { PrimaryInputComponent } from "../../components/primary-input/primary-input.component";
// biome-ignore lint/style/useImportType: <explanation>
import { Router } from "@angular/router";
// biome-ignore lint/style/useImportType: <explanation>
import { LoginService } from "../../services/login.service";
import { ToastrService } from "ngx-toastr";

@Component({
	selector: "app-login",
	standalone: true,
	imports: [LoginLayoutComponent, ReactiveFormsModule, PrimaryInputComponent],
	providers: [LoginService, ToastrService],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.scss",
})
export class LoginComponent {
	loginForm!: FormGroup;

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
		this.loginService
			.login(this.loginForm.value.email, this.loginForm.value.password)
			.subscribe({
				next: () => this.toastService.success("sucesso ao logar"),
				error: () => this.toastService.error("error ao logar"),
			});
	}

	navigate() {
		this.router.navigate(["/signup"]);
	}
}

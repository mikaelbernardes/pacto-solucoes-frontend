import { Component } from '@angular/core';
import { LoginLayoutComponent } from '../../components/login-layout/login-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    LoginLayoutComponent,
    PrimaryInputComponent
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  registerForm!: FormGroup;

	constructor(
		private router: Router,
		private loginService: LoginService,
		private toastService: ToastrService,
	) {
		this.registerForm = new FormGroup({
			name: new FormControl("", [Validators.required, Validators.nullValidator]),
			login: new FormControl("", [Validators.required, Validators.email]),
			password: new FormControl("", [
				Validators.required,
				Validators.minLength(6),
			]),
		});
	}

	submit() {
		this.loginService
			.login(this.registerForm.value.email, this.registerForm.value.password)
			.subscribe({
				next: () => this.toastService.success("sucesso ao logar"),
				error: () => this.toastService.error("error ao logar"),
			});
	}

	navigate() {
		this.router.navigate(["/login"]);
	}
}

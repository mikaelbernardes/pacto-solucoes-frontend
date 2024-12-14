import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginLayoutComponent } from '../../components/login-layout/login-layout.component';
import { LoginService } from '../../services/login.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    LoginLayoutComponent,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  registerForm!: FormGroup;
	hidePassword = true;
	userTypes = [
		{ value: 'CANDIDATE', label: 'Candidato' },
		{ value: 'RECRUITER', label: 'Recrutador' }
	];
	constructor(
		private router: Router,
		private loginService: LoginService,
		private toastService: ToastrService,
	) {
		this.registerForm = new FormGroup({
			name: new FormControl("", [Validators.required]),
			login: new FormControl("", [Validators.required, Validators.email]),
			password: new FormControl("", [
				Validators.required,
				Validators.minLength(6),
			]),
			userType: new FormControl("candidate", [Validators.required]),
		});
	}

  submit() {
    if (this.registerForm.valid) {
      this.loginService
        .signup(
          this.registerForm.value.name,
          this.registerForm.value.login,
          this.registerForm.value.password,
          this.registerForm.value.userType
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/login']);
            this.toastService.success('Sucesso ao cadastrar');
          },
          error: () => this.toastService.error('Erro ao cadastrar'),
        });
    } else {
      this.toastService.error('Por favor, corrija os erros no formulário.');
    }
  }

	navigate() {
		this.router.navigate(["/login"]);
	}
}

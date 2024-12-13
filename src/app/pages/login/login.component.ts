import { Component } from "@angular/core";
import { LoginLayoutComponent } from "../../components/login-layout/login-layout.component";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";

@Component({
	selector: "app-login",
	standalone: true,
	imports: [LoginLayoutComponent, ReactiveFormsModule],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.scss",
})
export class LoginComponent {
	loginForm!: FormGroup;

	constructor() {
		this.loginForm = new FormGroup({
			login: new FormControl("", [Validators.required, Validators.email]),
			password: new FormControl("", [
				Validators.required,
				Validators.minLength(6),
			]),
		});
	}
}

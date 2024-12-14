import type { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { SignupComponent } from "./pages/signup/signup.component";
import { HomeComponent } from "./pages/home/home.component";
import { AuthGuardService } from "./services/auth-guard.service";
import { NewVacancyComponent } from "./pages/new-vacancy/new-vacancy.component";

export const routes: Routes = [
	{
		path: "login",
		component: LoginComponent,
	},

	{
		path: "signup",
		component: SignupComponent,
	},
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "new-vacancy",
    component: NewVacancyComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'new-vacancy/:id',
    component: NewVacancyComponent,
    canActivate: [AuthGuardService]
  },
];

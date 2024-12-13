import { Component, Output, EventEmitter, Input } from "@angular/core";

@Component({
	selector: "app-login-layout",
	imports: [],
	templateUrl: "./login-layout.component.html",
	styleUrl: "./login-layout.component.scss",
})
export class LoginLayoutComponent {
  @Input() title = "";
  @Input() description = "";
  @Input() primaryButton = "";
  @Input() secondaryButton = "";
	@Output("submit") onSubmit = new EventEmitter();
	@Output("navigate") onNavigate = new EventEmitter();

	submit() {
		this.onSubmit.emit();
	}

	navigate() {
		this.onNavigate.emit();
	}
}

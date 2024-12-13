import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-login-layout',
	standalone: true,
	imports: [
		MatButtonModule
	],
	templateUrl: './login-layout.component.html',
	styleUrl: './login-layout.component.scss'
})
export class LoginLayoutComponent {
	@Input() title!: string;
	@Input() description!: string;
	@Input() primaryButton!: string;
	@Input() secondaryButton!: string;
	@Output() emitirSubmit = new EventEmitter();
	@Output() emitirNavigate = new EventEmitter();

	emitirSubmitEvent() {
		this.emitirSubmit.emit();
	}

	emitirNavigateEvent() {
		this.emitirNavigate.emit();
	}
}

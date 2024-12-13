import { Component, forwardRef, Input } from "@angular/core";
import {
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
	type ControlValueAccessor,
} from "@angular/forms";

@Component({
	selector: "app-primary-input",
	imports: [ReactiveFormsModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PrimaryInputComponent),
			multi: true,
		},
	],
	templateUrl: "./primary-input.component.html",
	styleUrl: "./primary-input.component.scss",
})
export class PrimaryInputComponent implements ControlValueAccessor {
	@Input() type = "text";
	@Input() inputName = "";
	@Input() placeholder = "";
	@Input() label = "";

	value = "";
	onChange: any = () => {};
	onTouched: any = () => {};

	onInput(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this.onChange(value);
	}

	writeValue(value: any): void {
		this.value = value;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {}
}

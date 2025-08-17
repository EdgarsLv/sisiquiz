import { Component, effect, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RadioButton } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { Message } from 'primeng/message';
import { doc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Logo } from '../../components/logo/logo';

@Component({
  selector: 'app-profile',
  imports: [
    InputTextModule,
    Message,
    ReactiveFormsModule,
    InputNumberModule,
    RadioButton,
    ButtonModule,
    Logo,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public isSubmiting = signal<boolean>(false);
  private formSubmitted = false;

  public profileForm: FormGroup = new FormGroup({
    age: new FormControl<number | undefined>(undefined, [
      Validators.required,
      Validators.min(18),
      Validators.max(99),
    ]),
    gender: new FormControl<string>('', [Validators.required]),
  });

  profileEffect = effect(() => {
    const profile = this.authService.profile();
    if (profile) {
      this.profileForm.patchValue(profile);
    }
  });

  public isInvalid(controlName: string) {
    const control = this.profileForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  public async onSubmit(): Promise<void> {
    this.formSubmitted = true;

    if (this.profileForm.valid) {
      this.isSubmiting.set(true);
      const userId = this.authService.authUser()!.uid;
      const age = this.profileForm.controls['age'].value;
      const sex = this.profileForm.controls['gender'].value;

      const userRef = doc(db, 'users', userId);
      await this.firebaseService.update(userRef, {
        age: age,
        gender: sex,
      });

      this.profileForm.reset();
      this.formSubmitted = false;
      this.authService.profile.set({ age, gender: sex });
      this.router.navigate(['iq-test']);
    }
  }
}

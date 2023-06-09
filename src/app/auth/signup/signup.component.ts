import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppState } from 'src/app/store/app.state';
import { signupStart } from '../state/auth.action';
import { setLoadingSpinner } from 'src/app/store/Shared/shared.action';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  showPassword: boolean = false;

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('Simform123', [Validators.required]),
    });
  }

  onSignUp() {
    if (this.signUpForm.invalid) {
      return;
    }
    const email = this.signUpForm.value.email;
    const password = this.signUpForm.value.password;
    console.log(email, password);
    this.store.dispatch(setLoadingSpinner({ status: true }));
    this.store.dispatch(signupStart({ email, password }));

    // Redirect to '/posts' after successful signup
    this.router.navigateByUrl('/posts');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}

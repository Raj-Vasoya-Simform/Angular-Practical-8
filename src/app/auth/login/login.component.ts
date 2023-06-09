import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { loginStart } from '../state/auth.action';
import { setLoadingSpinner } from 'src/app/store/Shared/shared.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;

  constructor(private store: Store<AppState>, private router: Router) {}
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('Simform123', [Validators.required]),
    });
  }

  onLoginSubmit() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.store.dispatch(setLoadingSpinner({ status: true }));
    this.store.dispatch(loginStart({ email, password }));

    // Redirect to the desired URL
    this.router.navigateByUrl('/posts');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}

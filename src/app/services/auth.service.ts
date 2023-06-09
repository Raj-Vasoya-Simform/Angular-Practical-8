import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponseData } from 'src/app/models/AuthResponseData.model';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { logout } from '../auth/state/auth.action';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  timeOutIntreval: any;

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  apiUrl = `http://localhost:3000/api/v1`

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCu4xiIP1flvogxoZgXTbU4F2sBQDmcw3k`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
  }

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCu4xiIP1flvogxoZgXTbU4F2sBQDmcw3k`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
  }

  runTimeOutInterval(user: User) {
    const todaysDate = new Date().getTime();
    const expirationDate = user.expireDate.getTime();
    const timeInterval = expirationDate - todaysDate;

    this.timeOutIntreval = setTimeout(() => {
      // Logout functionality or get the refresh token
      this.store.dispatch(logout())
    }, timeInterval);
  }

  setUserInLocalStorage(user: User) {
    localStorage.setItem('userDate', JSON.stringify(user));

    this.runTimeOutInterval(user);
  }

  getUserFromLocalStorage() {
    const userDateString = localStorage.getItem('userDate');

    if (userDateString) {
      const userDate = JSON.parse(userDateString);
      const expirationDate = new Date(userDate.expirationDate);
      const user = new User(
        userDate.email,
        userDate.token,
        userDate.localId,
        expirationDate
      );
      this.runTimeOutInterval(user);
      return user;
    }
    return null;
  }

  formatUser(data: AuthResponseData) {
    const expirationDate = new Date(
      new Date().getTime() + +data.expiresIn * 1000
    );
    const user = new User(
      data.email,
      data.idToken,
      data.localId,
      expirationDate
    );

    return user;
  }

  getErrorMessage(message: string) {
    switch (message) {
      case 'EMAIL_NOT_FOUND':
        return 'Email Not Found';
      case 'INVALID_PASSWORD':
        return 'Invalid Password';
      case 'EMAIL_EXISTS':
        return 'Email already exists.';
      default:
        return 'Unknown Error Occured. Please try again';
    }
  }

  logout() {
    localStorage.removeItem('userDate');
    if (this.timeOutIntreval) {
      clearTimeout(this.timeOutIntreval);
      this.timeOutIntreval = null;
    }
  }

  getCurrentUser(): User | null {
    const userDateString = localStorage.getItem('userDate');

    if (userDateString) {
      const userDate = JSON.parse(userDateString);
      const expirationDate = new Date(userDate.expirationDate);
      const user = new User(
        userDate.email,
        userDate.token,
        userDate.localId,
        expirationDate
      );

      return user;
    }

    return null;
  }
}

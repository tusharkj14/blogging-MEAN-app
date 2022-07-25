import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

const baseURL = 'http://localhost:3000/api/user';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private newToken: string;
  private authStatusListener = new Subject<boolean>();
  private userId: string;
  private logoutTimer: any;

  constructor(private httpC: HttpClient, private router: Router) {}

  fetchToken() {
    return this.newToken;
  }

  isAuthStatus() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createuser(username: string, email: string, password: string) {
    const newData: AuthData = {
      username: username,
      email: email,
      password: password,
    };
    this.httpC.post(baseURL + '/signup', newData).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  getuser(email: string, password: string) {
    const newData: AuthData = {
      username: 'temp_name',
      email: email,
      password: password,
    };
    this.httpC
      .post<{
        message: string;
        token: string;
        expiration: number;
        userId: string;
      }>(baseURL + '/signin', newData)
      .subscribe((response) => {
        const temp = response.token;
        this.newToken = temp;
        if (temp) {
          const duration = response.expiration;
          this.setAuthTimer(duration);
          this.userId = response.userId;
          // console.log(duration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const later = new Date(now.getTime() + duration * 1000);
          // console.log(later);
          this.saveAuthData(temp, later, this.userId);
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthuser() {
    const Info = this.getAuthData();
    if (!Info) return;
    const now = new Date();
    const notExpired = Info.expiration.getTime() - now.getTime();
    if (notExpired > 0) {
      this.newToken = Info.token;
      this.userId = Info.userId;
      this.isAuthenticated = true;
      this.setAuthTimer(notExpired / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.userId = '';
    this.newToken = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.logoutTimer);
    this.ClearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private getAuthData() {
    const t = localStorage.getItem('token');
    const e = localStorage.getItem('expiresIn');
    const u = localStorage.getItem('userId');
    if (!t || !e || !u) {
      return null;
    }
    return {
      token: t,
      expiration: new Date(e),
      userId: u,
    };
  }

  private saveAuthData(token: string, expirationTime: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expirationTime.toISOString());
    localStorage.setItem('userId', userId);
  }

  private ClearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('userId');
  }
}

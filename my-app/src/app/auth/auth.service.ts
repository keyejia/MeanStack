import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router
    ){}

  getToken(){
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string){
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(res=>{
        console.log(res);
        this.router.navigate(['/']);
      });
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post<{token: string, expireIn: number }>("http://localhost:3000/api/user/login", authData)
      .subscribe(response=>{
        const token = response.token;
        this.token = token;
        if (token){
          const expireInDuration = response.expireIn;
          this.setAuthTimer(expireInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expireInDuration * 1000);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expireIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expireIn>0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expireIn/1000);
      this.authStatusListener.next(true);
    }
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  private setAuthTimer(duration: number){
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(()=> {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate){
      return
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}

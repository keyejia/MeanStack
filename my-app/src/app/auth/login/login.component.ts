import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy{
  loading = false;
  authStatusSub: Subscription
  constructor(public authService: AuthService){}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
        authStatus =>{
          this.loading = false;
        }
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onLogin(form: NgForm){
    if (form.invalid){
      return
    }
    this.loading = true;
    this.authService.login(form.value.email, form.value.password);
  }
}

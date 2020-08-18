import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service'
import { Subscription } from 'rxjs';


@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {
  loading = false;
  private authStatusSub: Subscription
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

  onSignup(form: NgForm){
    if (form.invalid){
      return
    }
    this.loading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}

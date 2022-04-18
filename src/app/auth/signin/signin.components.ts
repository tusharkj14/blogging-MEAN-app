import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signin.components.html',
  styleUrls: ['./signin.components.css'],
})
export class SigninComponent {
  isloading = true;
  constructor(public AService: AuthService) {}
  onSignin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.AService.getuser(form.value.email, form.value.password);
  }
}

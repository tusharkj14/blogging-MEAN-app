import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.components.html',
  styleUrls: ['./signup.components.css'],
})
export class SignupComponent {
  constructor(public AService: AuthService) {}
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.AService.createuser(
      form.value.username,
      form.value.email,
      form.value.password
    );
  }
}

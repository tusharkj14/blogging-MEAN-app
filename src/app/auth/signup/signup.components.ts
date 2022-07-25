import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.components.html',
  styleUrls: ['./signup.components.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;

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
  ngOnInit(): void {
    this.authStatusSub = this.AService.getAuthStatusListener().subscribe();
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}

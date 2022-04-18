import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.components.html',
  styleUrls: ['./header.components.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  AuthenticationStatus: boolean = false;
  private authListenerSubs: Subscription;
  constructor(private AService: AuthService) {}

  ngOnInit(): void {
    this.AuthenticationStatus = this.AService.isAuthStatus();
    this.authListenerSubs = this.AService.getAuthStatusListener().subscribe(
      (myStatus) => {
        this.AuthenticationStatus = myStatus;
      }
    );
  }

  onLogout() {
    this.AService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}

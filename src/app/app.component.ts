import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { typePost } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title: any;

  constructor(private AServe: AuthService) {}
  ngOnInit(): void {
    this.AServe.autoAuthuser();
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { SigninComponent } from './auth/signin/signin.components';
import { SignupComponent } from './auth/signup/signup.components';
import { PostCreateComponent } from './posts/post-create/post-create.components';
import { PostListApp } from './posts/post-list/post-list.components';

const routes: Routes = [
  { path: '', component: PostListApp },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  {
    path: 'edit/:pID',
    component: PostCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}

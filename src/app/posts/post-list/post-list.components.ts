import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { typePost } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.components.html',
  styleUrls: ['./post-list.components.css'],
})
export class PostListApp implements OnInit, OnDestroy {
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private mySub: Subscription = new Subscription();
  Posts: typePost[] = [];
  panelOpenState = false;
  userId: string;
  AuthenticationStatus: boolean = false;
  private authListenerSubs: Subscription;

  constructor(public pService: PostsService, private AService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.pService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.AService.getUserId();
    this.mySub = this.pService
      .getPostsUpdatedListener()
      .subscribe((postData: { posts: typePost[]; postCount: number }) => {
        this.isLoading = false;
        this.Posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
    this.AuthenticationStatus = this.AService.isAuthStatus();
    this.authListenerSubs = this.AService.getAuthStatusListener().subscribe(
      (myStatus) => {
        this.userId = this.AService.getUserId();
        this.AuthenticationStatus = myStatus;
      }
    );
  }

  onDelete(p: typePost) {
    this.pService.deletePost(p).subscribe(() => {
      this.pService.getPosts(this.postsPerPage, this.currentPage);
    });
  }
  ngOnDestroy(): void {
    this.mySub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
  onChangedPage(e: PageEvent) {
    this.isLoading = true;
    this.currentPage = e.pageIndex + 1;
    this.postsPerPage = e.pageSize;
    this.pService.getPosts(this.postsPerPage, this.currentPage);
  }
}

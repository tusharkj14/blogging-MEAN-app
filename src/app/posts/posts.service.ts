import { typePost } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { query } from 'express';
import { map } from 'rxjs/operators';

const baseURL = 'http://localhost:3000/api/posts';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: typePost[] = [];
  private postsUpdated = new Subject<{
    posts: typePost[];
    postCount: number;
  }>();

  constructor(private httpC: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&curpage=${currentPage}`;
    this.httpC
      .get<{ message: string; posts: typePost[]; numPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                _id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            numPosts: postData.numPosts,
          };
        })
      )
      .subscribe((pData) => {
        // console.log(pData);
        this.posts = pData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: pData.numPosts,
        });
      });
    // return [...this.posts];
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPostbyID(PID: string) {
    return this.httpC.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>('http://localhost:3000/api/posts/' + PID);
  }

  addPost(title: string, content: string, image: File) {
    const newPost: typePost = {
      _id: '',
      title: title,
      content: content,
      imagePath: '',
      creator: '',
    };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.httpC
      .post<{ message: string; post: typePost }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: typePost | FormData;
    if (typeof image == 'object') {
      postData = new FormData();
      postData.append('_id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        _id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: '',
      };
    }
    this.httpC
      .put<{ mes: string }>('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(p: typePost) {
    return this.httpC.delete(`http://localhost:3000/api/posts/` + p._id);
  }
}

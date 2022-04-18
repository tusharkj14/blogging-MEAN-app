import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { typePost } from '../post.model';
import { PostsService } from '../posts.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { NONE_TYPE } from '@angular/compiler';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.components.html',
  styleUrls: ['./post-create.components.css'],
})
export class PostCreateComponent implements OnInit {
  EnteredTitle = '';
  EnteredContent = '';
  form: FormGroup | any;
  private mode = 'create';
  private postId: string = '';
  editPost: typePost;
  imagePrev: string;

  constructor(public pServe: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: mimeType,
      }),
    });
    this.route.paramMap.subscribe((pm: ParamMap) => {
      if (pm.has('pID')) {
        this.mode = 'edit';
        this.postId = pm.get('pID');
        this.pServe.getPostbyID(this.postId).subscribe((p) => {
          this.editPost = {
            imagePath: p.imagePath,
            _id: p._id,
            title: p.title,
            content: p.content,
            creator: p.creator,
          };
          console.log(this.editPost);
          this.form.setValue({
            title: this.editPost.title,
            content: this.editPost.content,
            image: this.editPost.imagePath,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = '';
      }
    });
  }
  onSubmitClick() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'edit') {
      this.pServe.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.pServe.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  onImagePick(event: Event) {
    if (event.target) {
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({ image: file });
      this.form.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePrev = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}

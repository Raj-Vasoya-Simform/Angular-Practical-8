import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { getPostsById } from '../state/posts.selector';
import { Post } from 'src/app/models/posts.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { updatePost } from '../state/posts.actions';
import { getCurrentRoute } from 'src/app/router/router.selector';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
})
export class EditPostComponent implements OnInit, OnDestroy {
  post!: Post;
  postForm!: FormGroup;
  postSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.postSubscription = this.store
      .select(getPostsById)
      .subscribe((post) => {
        if (post) {
          this.post = post;
          this.postForm.patchValue({
            title: post.title,
            description: post.description,
          });
        }
      });
  }

  createForm() {
    this.postForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ]),
    });
  }

  onUpdatePost() {
    if (this.postForm.invalid) {
      return;
    }

    const title = this.postForm.value.title;
    const description = this.postForm.value.description;

    const post: Post = {
      id: this.post.id,
      title,
      description,
    };

    this.store.dispatch(updatePost({ post }));
    this.router.navigate(['posts']);
  }

  ngOnDestroy(): void {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }
}

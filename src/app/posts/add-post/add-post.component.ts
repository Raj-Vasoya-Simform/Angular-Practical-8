import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 function
import { Post } from 'src/app/models/posts.model';
import { AppState } from 'src/app/store/app.state';
import { addPost } from '../state/posts.actions';
import { PostsService } from 'src/app/services/posts.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
})
export class AddPostComponent implements OnInit {
  postForm!: FormGroup;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.postForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
    });
  }

  onAddPost() {
    if (this.postForm.invalid) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    const post: Post = {
      id: uuidv4(),
      title: this.postForm.value.title,
      description: this.postForm.value.description,
      userId: currentUser.localID,
    };

    console.log(post.id);
    this.store.dispatch(addPost({ post }));

    // Show success message
    alert('Post added successfully');

    // Reset form fields
    this.postForm.reset();
  }
}

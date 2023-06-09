import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Post } from 'src/app/models/posts.model';
import { AppState } from 'src/app/store/app.state';
import { getPosts } from '../state/posts.selector';
import { deletePost, loadPosts } from '../state/posts.actions';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

interface Comment {
  id: string;
  postId: string;
  localId: string;
  commentText: string;
}

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css'],
})
export class PostsListComponent implements OnInit {
  posts!: Post[];

  post!: Post;
  selectedPostId: string | null = null;
  comments: Comment[] = [];
  commentText: string = '';

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private postService: PostsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.select(getPosts).subscribe((posts) => {
      this.posts = posts;
    });
    this.store.dispatch(loadPosts());

    // Load comments from localStorage if available
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      this.comments = JSON.parse(storedComments);
    }
  }

  onDeletePost(id: any) {
    const currentUser = this.authService.getCurrentUser();
    this.post = this.posts.find((post) => post.id === id); // Assign the selected post to this.post

    if (!currentUser || this.post.userId !== currentUser.localID) {
      // User is not authorized to delete this post
      return alert('You are not authorized to delete the post.');
    }

    if (confirm('Are you sure you want to delete the post?')) {
      this.store.dispatch(deletePost({ id }));
    }
  }

  onEditPost(id: any) {
    const currentUser = this.authService.getCurrentUser();
    this.post = this.posts.find((post) => post.id === id); // Assign the selected post to this.post

    if (!currentUser || this.post.userId !== currentUser.localID) {
      // User is not authorized to delete this post
      return alert('You are not authorized to edit the post.');
    } else {
      this.router.navigate(['/posts/edit', id]);
    }
  }

  onSubmitComment(id: string, commentText: string) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return;
    }

    const localId = currentUser.localID;
    const comment = {
      id: uuidv4(), // Generate unique comment ID
      postId: id,
      localId,
      commentText,
    };
    this.comments.push(comment);
    this.commentText = '';

    // Save comments to localStorage
    localStorage.setItem('comments', JSON.stringify(this.comments));
  }

  getCommentsByPostId(postId: string): any[] {
    return this.comments.filter((comment) => comment.postId === postId);
  }

  toggleCommentForm(postId: string) {
    if (this.selectedPostId === postId) {
      this.selectedPostId = null; // If the comment form is already visible, hide it
    } else {
      this.selectedPostId = postId; // Otherwise, show the comment form for the selected post
    }
  }
}

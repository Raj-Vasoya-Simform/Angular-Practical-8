import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/posts.model';
import { AppState } from 'src/app/store/app.state';
import { getPostsById } from '../state/posts.selector';
import { PostsService } from 'src/app/services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface Comment {
  id: string;
  postId: string;
  localId: string;
  commentText: string;
  editMode: boolean;
  updatedCommentText: string;
}

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css'],
})
export class SinglePostComponent implements OnInit {
  post: Observable<Post>;
  comment: Comment;
  postId: string;
  comments: Comment[] = [];
  commentText: string = '';
  allPosts: Post[] = [];
  postIds: string[] = [];

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private postService: PostsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.post = this.store.select(getPostsById);
    this.route.paramMap.subscribe((params) => {
      this.postId = params.get('id');
      this.loadComments();
    });
  }

  loadComments() {
    this.postService.getCommentsByPostId(this.postId).subscribe(
      (comments) => {
        this.comments = comments.map((comment) => ({
          id: comment.id, // Ensure the id property is included
          ...comment,
          editMode: false,
          updatedCommentText: comment.commentText,
        }));
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  editComment(comment: Comment) {
    const currentUser = this.authService.getCurrentUser();
    this.comment = this.comments.find((c) => c.localId === comment.localId); // Assign the selected comment to this.comment

    if (!currentUser || this.comment.localId !== currentUser.localID) {
      // User is not authorized to edit this comment
      alert('You are not authorized to edit the comment.');
    } else {
      comment.editMode = true;
    }
  }

  cancelEditComment(comment: Comment) {
    comment.editMode = false;
    comment.updatedCommentText = comment.commentText;
  }
  saveComment(comment: Comment) {
    // Retrieve comments from localStorage
    const storedComments: Comment[] = JSON.parse(localStorage.getItem('comments')) || [];

    // Update the specific comment with the edited text
    const updatedComments: Comment[] = storedComments.map((storedComment) => {
      if (storedComment.postId === comment.postId && storedComment.localId === comment.localId) {
        return {
          ...storedComment,
          commentText: comment.updatedCommentText,
        };
      }
      return storedComment;
    });

    // Save the updated comments back to localStorage
    localStorage.setItem('comments', JSON.stringify(updatedComments));

    // Reset the edit mode
    comment.editMode = false;
    window.location.reload()
  }


  deleteComment(comment: Comment) {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser || comment.localId !== currentUser.localID) {
      // User is not authorized to delete this comment
      alert('You are not authorized to delete the comment.');
    } else {
      if (confirm('Are you sure you want to delete the comment?')) {
        // Retrieve comments from localStorage
        const storedComments: Comment[] =
          JSON.parse(localStorage.getItem('comments')) || [];

        // Filter out the comment to delete based on ID
        const updatedComments: Comment[] = storedComments.filter(
          (c) => c.id !== comment.id
        );

        // Save the updated comments back to localStorage
        localStorage.setItem('comments', JSON.stringify(updatedComments));

        // Update the comments array in the component
        this.comments = updatedComments;
        window.location.reload();
      }
    }
  }
}

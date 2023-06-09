import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Post } from '../models/posts.model';

export interface Comment {
  id: any;
  postId: string;
  localId: string;
  commentText: string;
  // other comment properties...
}


@Injectable({
  providedIn: 'root',
})
export class PostsService {




  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http
      .get<Post[]>(`https://ngrx-e9be1-default-rtdb.firebaseio.com/posts.json`)
      .pipe(
        map((data) => {
          const posts: Post[] = [];
          for (let key in data) {
            posts.push({ ...data[key], id: key });
          }
          return posts;
        })
      );
  }

  addPost(post: Post): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(
      `https://ngrx-e9be1-default-rtdb.firebaseio.com/posts.json`,
      post
    );
  }

  updatePost(post: Post) {
    const postData = {
      [post.id]: { title: post.title, description: post.description },
    };
    return this.http.patch(
      `https://ngrx-e9be1-default-rtdb.firebaseio.com/posts.json`,
      postData
    );
  }

  deletePost(id: string) {
    return this.http.delete(
      `https://ngrx-e9be1-default-rtdb.firebaseio.com/posts/${id}.json`
    );
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(
      `https://ngrx-e9be1-default-rtdb.firebaseio.com/posts/${id}.json`
    );
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(
      `https://ngrx-e9be1-default-rtdb.firebaseio.com/comments.json`,
      comment
    );
  }


  getCommentsByPostId(postId: string): Observable<Comment[]> {
    // Assuming you are fetching comments from localStorage
    const comments: Comment[] = JSON.parse(localStorage.getItem('comments')) || [];
    const filteredComments = comments.filter((comment) => comment.postId === postId);
    return of(filteredComments);
  }
}



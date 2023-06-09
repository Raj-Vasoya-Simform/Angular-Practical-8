import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PostsService } from '../../services/posts.service';
import {
  addComment,
  addPost,
  addPostsSuccess,
  deletePost,
  deletePostSuccess,
  loadPosts,
  loadPostsSuccess,
  updatePost,
  updatePostSuccess,
} from './posts.actions';
import { filter, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import {
  ROUTER_NAVIGATION,
  RouterNavigatedAction,
  routerNavigatedAction,
} from '@ngrx/router-store';
import { Update } from '@ngrx/entity';
import { Post } from 'src/app/models/posts.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { getPosts } from './posts.selector';
import { dummyAction } from 'src/app/auth/state/auth.action';

@Injectable()
export class PostsEffects {
  constructor(
    private actions$: Actions,
    private postsService: PostsService,
    private store: Store<AppState>
  ) {}

  loadPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadPosts),
      withLatestFrom(this.store.select(getPosts)),
      mergeMap(([action, posts]) => {
        if (!posts.length) {
          return this.postsService.getPosts().pipe(
            map((posts) => {
              return loadPostsSuccess({ posts });
            })
          );
        }
        return of(dummyAction());
      })
    );
  });

  addPost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addPost),
      mergeMap((action) => {
        return this.postsService.addPost(action.post).pipe(
          map((data) => {
            const post = { ...action.post, id: data.name };
            return addPostsSuccess({ post });
          })
        );
      })
    );
  });

  // addComment$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(addComment),
  //     mergeMap((action) => {
  //       return this.postsService.addComment(action.comment).pipe(
  //         map((data) => {
  //           const commentId = data.userId; // Replace 'name' with the actual property name from the API response
  //           const comment = { ...action.comment, id: commentId };
  //           return addPostsSuccess({ comment });
  //         })
  //       );
  //     })
  //   );
  // });


  updatePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updatePost),
      switchMap((action) => {
        return this.postsService.updatePost(action.post).pipe(
          map((data) => {
            const updatePost: Update<Post> = {
              id: action.post.id,
              changes: {
                ...action.post,
              },
            };
            return updatePostSuccess({ post: updatePost });
          })
        );
      })
    );
  });

  deletePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deletePost),
      switchMap((action) => {
        return this.postsService.deletePost(action.id).pipe(
          map((data) => {
            return deletePostSuccess({ id: action.id });
          })
        );
      })
    );
  });

  getSinglePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigatedAction) => {
        return r.payload.routerState.url.startsWith('/posts/details');
      }),
      map((r: RouterNavigatedAction) => {
        return r.payload.routerState['params']['id'];
      }),
      withLatestFrom(this.store.select(getPosts)),
      switchMap(([id, posts]) => {
        if (!posts.length) {
          return this.postsService.getPostById(id).pipe(
            map((post) => {
              const postData = [{ ...post, id }];
              return loadPostsSuccess({ posts: postData });
            })
          );
        }
        return of(dummyAction());
      })
    );
  });
}

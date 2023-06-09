import { createEffect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Post } from 'src/app/models/posts.model';

export const ADD_POST = '[posts page] add post';
export const ADD_POST_SUCCESS = '[posts page] add post success';

export const ADD_COMMENT = '[posts page] add post';
export const ADD_COMMENT_SUCCESS = '[posts page] add post success';

export const UPDATE_POST = '[posts page] update post';
export const UPDATE_POST_SUCCESS = '[posts page] update post success';

export const DELETE_POST = '[posts page] delete post';
export const DELETE_POST_SUCCESS = '[posts page] delete post success';

export const LOAD_POSTS = '[posts page] load posts';
export const LOAD_POSTS_SUCCESS = '[posts page] load posts success';

export const addPost = createAction(ADD_POST, props<{ post: Post }>());
export const addPostsSuccess = createAction(
  ADD_POST_SUCCESS,
  props<{ post: Post }>()
);

export const addComment = createAction(ADD_COMMENT, props<{ comment: Comment }>());
export const addCommentsSuccess = createAction(
  ADD_COMMENT_SUCCESS,
  props<{ comment: Comment }>()
);

export const updatePost = createAction(UPDATE_POST, props<{ post: Post }>());
export const updatePostSuccess = createAction(
  UPDATE_POST_SUCCESS,
  props<{ post: Update<Post> }>()
);
export const deletePost = createAction(DELETE_POST, props<{ id: string }>());
export const deletePostSuccess = createAction(
  DELETE_POST_SUCCESS,
  props<{ id: string }>()
);

export const loadPosts = createAction(LOAD_POSTS);
export const loadPostsSuccess = createAction(
  LOAD_POSTS_SUCCESS,
  props<{ posts: Post[] }>()
);

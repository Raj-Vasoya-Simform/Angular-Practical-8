import { createReducer, on } from '@ngrx/store';
import { initialState, postsAdapter } from './posts.state';
import {
  addPostsSuccess,
  deletePostSuccess,
  loadPostsSuccess,
  updatePostSuccess,
} from './posts.actions';

const _postsReducer = createReducer(
  initialState,
  on(addPostsSuccess, (state, action) => {
    return postsAdapter.addOne(action.post, state);
  }),
  on(updatePostSuccess, (state, action) => {
    return postsAdapter.updateOne(action.post, state);
  }),
  on(deletePostSuccess, (state, action) => {
    return postsAdapter.removeOne(action.id, state);
  }),
  on(loadPostsSuccess, (state, action) => {
    return postsAdapter.setAll(action.posts, state);
  })
);

export function postsReducer(state: any, action: any) {
  return _postsReducer(state, action);
}

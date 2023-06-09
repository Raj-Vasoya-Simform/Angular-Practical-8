import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PostsState, postsAdapter } from './posts.state';
import { getCurrentRoute } from 'src/app/router/router.selector';
import { RouterstateUrl } from '../../router/custom-serializer';

const getPostsState = createFeatureSelector<PostsState>('posts');

export const postsSelectors = postsAdapter.getSelectors();

export const getPosts = createSelector(getPostsState, postsSelectors.selectAll);
export const getPostEntities = createSelector(
  getPostsState,
  postsSelectors.selectEntities
);

export const getPostsById = createSelector(
  getPostEntities,
  getCurrentRoute,
  (posts, route: RouterstateUrl) => {
    return posts ? posts[route.params['id']] : null;
  }
);

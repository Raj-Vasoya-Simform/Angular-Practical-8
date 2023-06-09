import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterstateUrl } from './custom-serializer';

export const getRouterState =
  createFeatureSelector<RouterReducerState<RouterstateUrl>>('router');

export const getCurrentRoute = createSelector(getRouterState, (router) => {
  return router.state;
});

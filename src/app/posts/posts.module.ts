import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddPostComponent } from './add-post/add-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { StoreModule } from '@ngrx/store';
import { postsReducer } from './state/posts.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PostsEffects } from './state/posts.effects';
import { SinglePostComponent } from './single-post/single-post.component';

const routes: Routes = [
  {
    path: '',
    component: PostsListComponent,
    children: [
      {
        path: 'add',
        component: AddPostComponent,
      },
      {
        path: 'edit/:id',
        component: EditPostComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [PostsListComponent, AddPostComponent, EditPostComponent, SinglePostComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature('posts', postsReducer),
    EffectsModule.forFeature([PostsEffects]),
  ],
})
export class PostsModule {}

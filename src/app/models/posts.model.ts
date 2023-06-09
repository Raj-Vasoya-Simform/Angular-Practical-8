export interface Post {
  id?: string;
  title: string;
  description: string;
  userId?: string;
  comments?: Comment[]; // Array to store comments
}

export interface Comment {
  postId: string;
  localId: string;
  commentText: string;
}

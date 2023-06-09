import { User } from 'src/app/models/User.model';

export interface AuthState {
  user: User | null;
}

export const initialState: AuthState = {
  user: null,
};

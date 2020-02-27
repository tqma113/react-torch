/**
 * History session three kind change type.
 * This is like a stack manage.
 */
export enum Action {
  // switch to anther session in session history
  POP = 'POP',
  // push new session into session history and switch to it.
  PUSH = 'PUSH',
  // replace current session
  REPLACE = 'REPLACE'
}

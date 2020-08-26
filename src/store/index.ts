export type Action<S extends {}, P = any> = (state: S, payload: P) => S;

export type Actions<S extends {}> = Record<string, Action<S>>;

export type Args<S extends object, A extends Action<S>> = A extends (
  state: S,
  ...args: infer Args
) => S
  ? Args
  : never;

export type Curring<S extends object, A extends Action<S>> = A extends (
  state: S,
  ...args: infer Args
) => S
  ? (...args: Args) => S
  : () => S;

export type Currings<S extends object, AS extends Actions<S>> = {
  [k in keyof AS]: Curring<S, AS[k]>;
};

export type Task<S extends object, AS extends Actions<S>> = {
  actionType: keyof AS;
  payload: any;
};
export type Data<S extends object, AS extends Actions<S>> = {
  tasks: Task<S, AS>[];
  previousState: S;
  currentState: S;
  start: number;
  end: number;
};

export type Listener<S extends object, AS extends Actions<S>> = (
  data: Data<S, AS>
) => void;

export type Store<S extends object, AS extends Actions<S>> = {
  listen: (listener: Listener<S, AS>) => void;
  readonly state: S;
  readonly actions: Currings<S, AS>;
  readonly UNSAFE_setState: (s: S) => void;
};

function getKeys<T extends {}>(o: T): Array<keyof T> {
  return Object.keys(o) as Array<keyof T>;
}

export function createStore<S extends object, AS extends Actions<S>>(
  state: S,
  actions: AS
) {
  const curryActions = getKeys(actions).reduce((obj, actionType) => {
    if (typeof actions[actionType] === "function") {
      obj[actionType] = ((...args: Args<S, AS[typeof actionType]>) =>
        dispatch(actionType, ...args)) as Curring<S, AS[keyof AS]>;
    } else {
      throw new Error(
        `Action must be a function. accept ${actions[actionType]}`
      );
    }
    return obj;
  }, {} as Currings<S, AS>);

  let taskQueue: Task<S, AS>[] = [];
  function dispatch<K extends keyof AS>(
    actionType: keyof AS,
    ...args: Args<S, AS[K]>
  ) {
    const task: Task<S, AS> = {
      actionType,
      payload: args[0],
    };
    taskQueue.push(task);
    if (!isConsuming) {
      consume();
    }
  }

  let isConsuming = false;
  function consume() {
    if (taskQueue.length > 0) {
      isConsuming = true;

      let task: Task<S, AS> | undefined = undefined;
      let nextState: S | undefined = undefined;
      let consumedTasks: Task<S, AS>[] = [];

      const start = new Date().getTime();
      while ((task = taskQueue.shift())) {
        consumedTasks.push(task);
        nextState = actions[task.actionType](state, task.payload);
      }
      const end = new Date().getTime();

      if (nextState !== undefined && consumedTasks.length > 0) {
        updateState(nextState, state, consumedTasks, start, end);
      }

      isConsuming = false;
    }
  }

  function updateState(
    nextState: S,
    previousState: S,
    tasks: Task<S, AS>[],
    start: number,
    end: number
  ) {
    if (nextState === state) {
      return;
    }

    state = nextState;

    const data: Data<S, AS> = {
      tasks,
      previousState,
      currentState: nextState,
      start,
      end,
    };
    listeners.forEach((listener) => listener(data));
  }

  let listeners: Listener<S, AS>[] = [];
  function listen(listener: Listener<S, AS>) {
    listeners.push(listener);

    return () => {
      const nextListeners = listeners.filter((ltnr) => ltnr !== listener);
      if (nextListeners.length === listeners.length) {
        console.warn(
          "You want to unsubscribe a nonexistent listener. Maybe you had unsubscribed it"
        );
      } else {
        listeners = nextListeners;
      }
    };
  }

  return {
    listen,
    get state(): S {
      return state;
    },
    get actions(): Currings<S, AS> {
      return curryActions;
    },
    UNSAFE_setState(s: S) {
      updateState(s, state, [], new Date().getTime(), new Date().getTime());
    },
  };
}

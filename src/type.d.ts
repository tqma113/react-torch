declare global {
  var __SRC__: string
  namespace NodeJS {
    interface Global {
      __SRC__: string
    }
  }

  interface Window {
    __SRC__: string
  }
}

declare let __SRC__: string
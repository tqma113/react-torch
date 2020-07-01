# React-torch

A react framework.

## Getting Started

#### Create Project

```shell
> mkdir your-project

> cd your-project

> npm init -y
```

#### Install Dependences

```
> npm install react react-dom react-torch typescript
```

> Without Typescripts: `npm install react react-dom react-torch`

#### Add Scripts

Add follow code in `package.json`

```json
{
    "scripts": {
        "start": "react-imvc start",
        "build": "react-imvc build",
        "test": "react-imvc test"
    }
}
```

#### Add `src` and `index`

```ts
// src/index.ts
export default [
    {
        path: '/',
        controller: () => import('./home/Controller')
    }
]
```

#### Add Page


```ts
// src/home/index.ts
import React from 'react'
import { createPage } from 'react-torch/page'
import { createStore } from 'react-torch/store'

export default createPage((history, context) => {

  return [
    () => {
      return <div>about</div>
    },
    createStore({}, {})
  ]
})
```

#### Start With Development

```shel
npm run dev
```

#### Build

```shell
npm run build
```

#### Start After Build In Production

```shell
npm start
```

## Document

Visit [docs](https://github.com/tqma113/react-torch/docs/README.md) to view the documentation.

## Contributing

Please see our [contributing.md](https://github.com/tqma113/react-torch/contributing.md).

## Author

Ma Tianqi([@tqma113](https://github.com/tqma113))
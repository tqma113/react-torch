# React-torch

[![License](https://img.shields.io/npm/v/react-torch.svg)](https://www.npmjs.com/package/react-torch)
[![Action Status](https://github.com/tqma113/react-torch/workflows/Torch/badge.svg)](https://github.com/tqma113/react-torch/actions)
[![License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://www.npmjs.com/package/react-torch)
[![PRs-welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tqma113/react-torch/pull/new/master)

[![NPM](https://nodei.co/npm/react-torch.png?downloads=true)](https://nodei.co/npm/react-torch/)

A react framework.

## Getting Started

#### Create Project

```shell
> mkdir your-project

> cd your-project

> npm init -y
```

#### Install Dependences

```shell
> npm install react react-dom react-torch typescript
```

> Without Typescripts: `npm install react react-dom react-torch`

#### Add Scripts

Add follow code in `package.json`

```json
{
    "scripts": {
        "dev": "torch dev",
        "build": "torch build",
        "start": "yarn dev",
        "debug": "node --inspect-brk node_modules/.bin/torch dev",
        "serve": "torch start",
        "help": "torch --help",
        "version": "torch --version",
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

```shell
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
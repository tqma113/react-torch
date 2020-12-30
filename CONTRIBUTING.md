# Contributing to React-torch

1. Fork this repository to your own GitHub account and then clone it to your local device.
2. Create a new branch `git checkout -b MY_BRANCH_NAME`
3. Install the dependencies: `npm install`
4. Run `npm run build` to build the code.
5. Run `npm run dev:dev`, `npm run dev:build` or `npm run dev:start` to build and watch for code changes
6. In a new terminal, run yarn types to compile declaration files from TypeScript
7. The development branch is `master` (this is the branch pull requests should be made against). On a release, the relevant parts of the changes in the `master` branch are rebased into master.

## To run tests

Make sure you have chromedriver installed for your Chrome version. You can install it with

- brew cask install chromedriver on Mac OS X
- chocolatey install chromedriver on Windows
- Or manually download the version that matches your installed chrome version (if there's no match, download a version under it, but not above) from the chromedriver repo and add the binary to <next-repo>/node_modules/.bin
  Running all tests:

```
npm run test
```

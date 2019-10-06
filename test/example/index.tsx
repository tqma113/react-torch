import ReactTorch from '../../src'

const options = {
  src: './App.tsx',
  root: __dirname,
  container: 'root'
}

try {
  ReactTorch.render(options)

} catch (e) {
  let err = new Error(e)
  console.log(err.stack)
}
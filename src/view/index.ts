import { GenerateView } from '../index'

const generateView: GenerateView = ({
  container,
  content
}) => {
  return `
    <html>
      <head>
        <title>ssr</title>
      </head>
      <body>
        <div id="${container}">${content}</div>
      </body>
    </html>
  `
}

export default generateView
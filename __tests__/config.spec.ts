import path from 'path'
import { mergeConfig, requireConfig } from '../src/config'

describe('config', () => {
  it('mergeCofnig', () => {
    expect(mergeConfig({})).toMatchObject({
      title: 'React Torch',
      dir: process.cwd(),
      port: '80',
      src: path.resolve(process.cwd(), 'src'),
      mdlw: path.resolve(process.cwd(), 'mdlw'),
      ssr: true,
    })

    expect(
      mergeConfig({
        port: '3000',
      })
    ).toMatchObject({
      title: 'React Torch',
      dir: process.cwd(),
      port: '3000',
      src: path.resolve(process.cwd(), 'src'),
      mdlw: path.resolve(process.cwd(), 'mdlw'),
      ssr: true,
    })
  })

  it('requireConfig', () => {
    const config = requireConfig(
      path.resolve(__dirname, './config/torch.config.ts')
    )

    expect(config).toMatchObject({
      ssr: false,
    })
  })
})

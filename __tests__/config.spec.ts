import os from 'os'
import path from 'path'
import { mergeConfig, requireConfig } from '../src/internal/config'

describe('config', () => {
  it('mergeCofnig', () => {
    expect(mergeConfig({})).toMatchObject({
      title: 'React Torch',
      dir: process.cwd(),
      port: 80,
      src: path.resolve(process.cwd(), 'src'),
      ssr: true,
    })

    expect(
      mergeConfig({
        port: 3000,
      })
    ).toMatchObject({
      title: 'React Torch',
      dir: process.cwd(),
      port: 3000,
      src: path.resolve(process.cwd(), 'src'),
      ssr: true,
    })
  })

  it('requireFile', () => {
    const config = requireConfig(
      path.resolve(__dirname, './fixtures/config/torch.config.ts')
    )

    expect(config).toMatchObject({
      ssr: false,
      src: 'foo',
      dir: os.homedir(),
    })
  })
})

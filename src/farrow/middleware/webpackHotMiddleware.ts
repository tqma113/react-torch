import { parse } from 'url'
import { useReq, useRes } from 'farrow-http'
import type { IncomingMessage, ServerResponse } from 'http'
import type { Compiler, Stats, StatsCompilation } from 'webpack'
import type { HttpMiddleware } from 'farrow-http'

export type Log = false | ((...args: any[]) => void)

export type Action = 'built' | 'sync'

export type Payload = object

export type WebpackHotMiddlewareOptions = {
  log?: Log
  path?: string
  heartbeat?: number
}

export function webpackHotMiddleware(
  compiler: Compiler,
  opts: WebpackHotMiddlewareOptions = {}
): HttpMiddleware {
  const options = {
    log: typeof opts.log == 'undefined' ? console.log.bind(console) : opts.log,
    path: opts.path || '/__webpack_hmr',
    heartbeat: opts.heartbeat || 10 * 1000,
  }

  const eventStream = createEventStream(options.heartbeat)
  let latestStats: Stats | null = null
  let closed = false

  compiler.hooks.invalid.tap('webpack-hot-middleware', onInvalid)
  compiler.hooks.done.tap('webpack-hot-middleware', onDone)

  function onInvalid() {
    if (closed) return
    latestStats = null
    if (opts.log) opts.log('webpack building...')
    eventStream.publish({ action: 'building' })
  }
  function onDone(statsResult: Stats) {
    if (closed) return
    // Keep hold of latest stats so they can be propagated to new clients
    latestStats = statsResult
    publishStats('built', latestStats, eventStream, opts.log)
  }

  const middleware: HttpMiddleware = (request, next) => {
    const req = useReq()
    const res = useRes()
    if (closed) return next()
    if (!pathMatch(request.pathname, options.path)) return next()
    eventStream.handler(req, res)
    if (latestStats) {
      // Explicitly not passing in `log` fn as we don't want to log again on
      // the server
      publishStats('sync', latestStats, eventStream)
    }
    return next()
  }

  return middleware
}

export type EventStream = {
  close: () => void
  handler: (req: IncomingMessage, res: ServerResponse) => void
  publish: (payload: any) => void
}

function createEventStream(heartbeat: number) {
  var clientId = 0
  var clients: Record<string, ServerResponse> = {}
  function everyClient(fn: (client: ServerResponse) => void) {
    Object.keys(clients).forEach(function (id) {
      fn(clients[id])
    })
  }
  var interval = setInterval(function heartbeatTick() {
    everyClient(function (client: ServerResponse) {
      client.write('data: \uD83D\uDC93\n\n')
    })
  }, heartbeat).unref()
  return {
    close: function () {
      clearInterval(interval)
      everyClient(function (client: ServerResponse) {
        if (!client.finished) client.end()
      })
      clients = {}
    },
    handler: function (req: IncomingMessage, res: ServerResponse) {
      var headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream;charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        // While behind nginx, event stream should not be buffered:
        // http://nginx.org/docs/http/ngx_http_proxy_module.html#proxy_buffering
        'X-Accel-Buffering': 'no',
      }

      var isHttp1 = !(parseInt(req.httpVersion) >= 2)
      if (isHttp1) {
        req.socket.setKeepAlive(true)
        Object.assign(headers, {
          Connection: 'keep-alive',
        })
      }

      res.writeHead(200, headers)
      res.write('\n')
      var id = clientId++
      clients[id] = res
      req.on('close', function () {
        if (!res.finished) res.end()
        delete clients[id]
      })
    },
    publish: function (payload: Payload) {
      everyClient(function (client) {
        client.write('data: ' + JSON.stringify(payload) + '\n\n')
      })
    },
  }
}

function publishStats(
  action: Action,
  statsResult: Stats,
  eventStream: EventStream,
  log?: Log
) {
  var stats = statsResult.toJson({
    all: false,
    cached: true,
    children: true,
    modules: true,
    timings: true,
    hash: true,
  })
  // For multi-compiler, stats will be an object with a 'children' array of stats
  var bundles = extractBundles(stats)
  bundles.forEach(function (stats) {
    // @ts-ignore
    var name = stats.name || ''

    // Fallback to compilation name in case of 1 bundle (if it exists)
    if (bundles.length === 1 && !name && statsResult.compilation) {
      // @ts-ignore
      name = statsResult.compilation.name || ''
    }

    if (log) {
      log(
        'webpack built ' +
          (name ? name + ' ' : '') +
          stats.hash +
          ' in ' +
          stats.time +
          'ms'
      )
    }
    eventStream.publish({
      name: name,
      action: action,
      time: stats.time,
      hash: stats.hash,
      warnings: stats.warnings || [],
      errors: stats.errors || [],
      modules: buildModuleMap(stats.modules),
    })
  })
}

function extractBundles(stats: StatsCompilation): StatsCompilation[] {
  // Stats has modules, single bundle
  // @ts-ignore
  if (stats.modules) return [stats]

  // Stats has children, multiple bundles
  if (stats.children && stats.children.length) return stats.children

  // Not sure, assume single
  return [stats]
}

function buildModuleMap(modules: StatsCompilation['modules'] = []) {
  var map: Record<number | string, string> = {}
  modules.forEach(function (module) {
    if (!!module.id && !!module.name) map[module.id] = module.name
  })
  return map
}

function pathMatch(url: string, path: string) {
  try {
    return parse(url).pathname === path
  } catch (e) {
    return false
  }
}

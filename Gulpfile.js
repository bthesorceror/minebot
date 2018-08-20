const gulp = require('gulp')
const wrap = require('minecraft-wrap')
const path = require('path')
const log = require('fancy-log')

gulp.task('download', (done) => {
  wrap.downloadServer('1.12', 'server.jar', done)
})

gulp.task('run', ['download'], (done) => {
  const jarPath = path.join(__dirname, 'server.jar')
  const options = { 'online-mode': 'false' }
  const server = new wrap.WrapServer(jarPath, './server', {maxMem: '2048', minMem: '2048'})

  log.info('Server wrapped...')

  server.on('error', done)
  server.on('line', console.info)

  log.info('Events attached...')

  server.startServer(options, (err) => {
    if (err) {
      log.error(err)
      done(err)
    }
  })

  process.stdin.on('data', (line) => {
    server.writeServer(line)
  })
})

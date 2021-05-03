let currentNodeVersion = process.versions.node
let semver = currentNodeVersion.split('.')
let major = semver[0]

if (major < 10) {
    console.error(
        'You are running Node ' +
        currentNodeVersion +
        '.\n' +
        'Create app requires Node 10 or higher. \n' +
        'Please update your version of Node.'
    )
    process.exit(1)
}

const {
    init
} = require('./createApp')

init()
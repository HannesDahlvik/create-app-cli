const logger = (type: 'server' | 'error' | 'socket', msg: string | any) => {
    if (type === 'server') console.log(`[server]: ${msg}`)
    if (type === 'error') console.error(`[server]: ${msg}`)
    if (type === 'socket') console.log(`[socket]: ${msg}`)
}

export default logger
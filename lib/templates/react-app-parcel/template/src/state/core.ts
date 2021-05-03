import App from './app'
import state from './state'

const core = {
    state
}

export default App.Core(core)

export type ICore = typeof core
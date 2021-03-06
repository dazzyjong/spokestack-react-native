import {
    NativeEventEmitter,
    NativeModules
} from 'react-native'

const { Spokestack } = NativeModules
const spokestackEmitter = new NativeEventEmitter(Spokestack)

class RNSpokestack {
  // Class methods

  constructor () {
    this._loaded = false
    this._listeners = null
    this._events = {
      'onSpeechEvent': this._onSpeechEvent.bind(this)
    }
  }

  destroy () {
    if (this._listeners) {
      this._listeners.map((listener, index) => listener.remove())
      this._listeners = null
    }
  }

  initialize (pipelineConfig) {
    if (!this._loaded && !this._listeners) {
      this._listeners = Object.keys(this._events)
        .map((key, index) => spokestackEmitter.addListener(key, this._events[key]))
    }

    // I also don’t want to have to provide a fixed list of aliases inside the framework. so we may just have to set up a mapping section inside the config that maps logical names to ios/android component names

    Spokestack.initialize(pipelineConfig)
  }

  start () {
    Spokestack.start()
  }

  stop () {
    Spokestack.stop()
  }

  // Events

  _onSpeechEvent (e) {
    switch (e.event.toLowerCase()) {
      case 'activate':
        if (this.onSpeechStarted) {
          this.onSpeechStarted(e)
        }
        break
      case 'deactivate':
        if (this.onSpeechEnded) {
          this.onSpeechEnded(e)
        }
        break
      case 'recognize':
        if (this.onSpeechRecognized) {
          this.onSpeechRecognized(e)
        }
        break
      default:
        break
    }
  }
}

module.exports = new RNSpokestack()

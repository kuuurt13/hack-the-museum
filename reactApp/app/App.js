import React, { Component } from 'react'
import {
  NativeModules,
  View,
} from 'react-native'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers/index'
import sagas from './sagas'
import * as actions from './actionTypes'

import { GalleryLocationFinder } from './screens/'
import { GalleryLocationService } from './utils'

class App extends Component {
  
  constructor(props) {
    super(props)
    if (props.store === undefined) {
      this.appStore = createStore(reducer)
    }
  }

  componentDidMount = () => this.initNativeServices()

  initNativeServices = () => {
    // We need to know the users location
    GalleryLocationService.requestLocationPermissions()
    // Load the galleries into the native app store
    GalleryLocationService.loadGeoLocationData(res => {
      this.appStore.dispatch({ type: actions.SET_GALLERY_LOCATIONS_RETRIEVED, payload: res.didFetchLocations })
    })
  }

  render() {
    const store = this.props.store !== undefined ? this.props.store : this.appStore
    console.log(store)
    return (<Provider store={store}>
      <View style={styles.container}>
        <GalleryLocationFinder />
      </View>
    </Provider>)
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    backgroundColor: '#b042f4',
    margin: 10,
  },
  disabled: {
    backgroundColor: 'grey',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
}

export default App
import React from 'react'

import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }
import { StyleSheet, View, Dimensions, Text, Button, LogBox } from "react-native";

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import loginReducer from './src/redux/LoginReducer';

import  Main  from './src/Main/Main'
/* import Tmp from './src/tmp'
 */
import { firebase } from './src/firebase/config'
import { Component } from 'react';

/* LogBox.ignoreAllLogs('disable') */
console.disableYellowBox = true;
const store = createStore(loginReducer);

import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://2ef85876e96a46098389fd6838751097@o578121.ingest.sentry.io/5734175',
  enableInExpoDevelopment: true,
  debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
});

// Access any @sentry/react-native exports via:
Sentry.Native

// Access any @sentry/browser exports via:
Sentry.Browser

export default class App extends Component {

  /* const [loading, setLoading] = useState(true)
  const [user, setUser] = useState('')
 */

  /* useState(() => {
    if (loading) {
      return (
        <Text>Something</Text>
      )
    }
  })


  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });
  }, []); */
  render(){
  return (
    <Provider store={store}>
      <Main/>
    </Provider>
  );
  }
}
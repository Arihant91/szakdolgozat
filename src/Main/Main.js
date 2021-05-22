import 'react-native-gesture-handler';
import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen, HomeScreen, RegistrationScreen, ExerciseScreen, StatisticsScreen } from '../screens'
import { PermissionLocation } from '../permissions'
import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import { firebase } from '../firebase/config'
import { connect } from 'react-redux';

const Stack = createStackNavigator();

class Main extends Component {


  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {this.props.login.user === "undefined" ? (
            <>
              <Stack.Screen name="Login" component ={LoginScreen}/>
              <Stack.Screen name="Registration" component={RegistrationScreen} />             
            </>

          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen}/>
              <Stack.Screen name="Permission" component={PermissionLocation}/>
              <Stack.Screen name="Exercise" component={ExerciseScreen}/>
              <Stack.Screen name="Statistics" component={StatisticsScreen}/>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const mapStateToProps = (state) => {
  console.log("mainbe a redux")
  console.log(state)
  const { login } = state
  return { login }
}


export default connect(mapStateToProps)(Main);
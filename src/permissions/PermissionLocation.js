
import React, { Component } from 'react';
import * as Permissions from 'expo-permissions';
import { usePermissions } from '@use-expo/permissions';
import { useState } from 'react';

import { useEffect } from 'react/cjs/react.production.min';
import { Button, Linking, Text, TouchableOpacity, View } from 'react-native';

import PermissionMotion from './PermissionMotion'
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ExerciseScreen from '../screens/ExerciseScreen/ExerciseScreen';


function PermissionLocation({navigation}) {
  const [permission, askPermission] = usePermissions(Permissions.LOCATION, { ask: true });
  const tmp = () => {navigation.navigate('Exercise')
  }
  if (!permission) {
      return null;
  } 

  if (permission.status !== 'granted') {
       return (
          <View>
              <Text>We need permissions to use the GPS</Text>
              {permission?.canAskAgain
                  ? <Button onPress={askPermission} title='Give permission' />
                  : <Button onPress={Linking.openSettings} title='Open app settings' />
              }
          </View>
      );
  } 
  navigation.navigate('Exercise')
  return <></>
}


export default PermissionLocation

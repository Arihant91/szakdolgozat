import React, { Component } from 'react';
import * as Permissions from 'expo-permissions';
import { usePermissions } from '@use-expo/permissions';
import { Button, Linking, Text, TouchableOpacity, View } from 'react-native';

import ExerciseScreen from '../screens/ExerciseScreen/ExerciseScreen';

export default function PermissionMotion(props) {
    const [permission, askPermission] = usePermissions(Permissions.MOTION, { ask: true });
  
     if (!permission) {
        return null;
    } 
  
    if (permission.status !== 'granted') {
         return (
            <View>
                <Text>We need permissions to use the Motionsensors</Text>
                {permission?.canAskAgain
                    ? <Button onPress={askPermission} title='Give permission' />
                    : <Button onPress={Linking.openSettings} title='Open app settings' />
                }
            </View>
        );
    }
  
    return (
        <ExerciseScreen/>
    );
  }


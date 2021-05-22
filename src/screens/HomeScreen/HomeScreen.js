import React from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { connect } from 'react-redux';
import { firebase } from '../../firebase/config'
import { Component } from 'react';

class HomeScreen extends Component {

    constructor(props) {
        super(props);


    }

    exercisePress = () => {
        this.props.navigation.navigate('Exercise')
    }

    statisticsPress = () => {
        this.props.navigation.navigate('Statistics')
    }

    logOutPress = () => {
        this.props.changeLogOut("Undefined")
        firebase.auth().signOut().then(this.props.changeLogOut("Undefined")
        , function(error) {
          console.log('error')
      });
    }

    render(){
    return(
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Text style ={styles.title}>MobileApp</Text>    
                <TouchableOpacity  style={styles.button}
                        onPress={() => this.exercisePress()}>
                        <Text style={styles.buttonTitle}>Exercise</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.button}
                        onPress={() => this.statisticsPress()}>
                        <Text style={styles.buttonTitle}>Statistics</Text>
                </TouchableOpacity>
                <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.logOutPress()}>
                        <Text style={styles.buttonTitle}>Logout</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>

    )}
}

const mapStateToProps = (state) => {
    const { login } = state
    return { login }
}

function mapDispatchToProps(dispatch) {
    return {
        changeLogOut : (user) => dispatch({type:'LOGGED_OUT', payload : user})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
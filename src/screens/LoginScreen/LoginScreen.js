import React, { useState, Component } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import styles from './styles';
import {changeLogin} from '../../redux/LoginActions'


import { firebase } from '../../firebase/config'

class LoginScreen extends Component{

    constructor(props) {
        super(props);

        this.state = {
            email : '',
            password : ''
        }


    }

    setEmail(email){
        this.setState({
            email : email
        })
    }

    setPassword(password){
        this.setState({
            password : password
        })
        
    }


    onFooterLinkPress = () => {
        this.props.navigation.navigate('Registration')
    }

    onLoginPress = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((response) => {
                const uid = response.user.uid
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert("User does not exist anymore.")
                            return;
                        }
                        const user = firestoreDocument.data()

                        this.props.changeLogin(user)
                        //this.props.navigation.navigate('Home')
                    })
                    .catch(error => {
                        alert(error)
                    });
            })
            .catch(error => {
                alert(error)
            })
    }
    render(){
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Text style ={styles.title}>MobileApp</Text>
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => this.setEmail(text)}
                    value={this.state.email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => this.setPassword(text)}
                    value={this.state.password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={this.onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
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
        changeLogin : (user) => dispatch({type:'LOGGED_IN', payload : user})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
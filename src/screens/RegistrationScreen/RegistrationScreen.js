import React, { Component } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View , InputCountrySelector, Alert} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { connect } from 'react-redux';
import { firebase } from '../../firebase/config';


class RegistrationScreen extends Component {
    /* const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('') */

    constructor(props) {
        super(props);

        this.state = {
            fullName : '',
            email: '',
            weight: '',
            height: '',
            age: '',
            password: '',
            confirmPassword: '',
        }

    }

    handleDropdownChange = (name) => (value) => {
        this.setState({ [name]: value })
    }

    setFullName(fullName){
        this.setState({
            fullName : fullName
        })
    }

    setEmail(email){
        this.setState({
            email : email
        })
    }

    getEmail(){
        return this.state.email
    }

    setWeight(weight){
        this.setState({
            weight : weight
        })
    }

    setHeight(height){
        this.setState({
            height : height
        })
    }

    setAge(age){
        this.setState({
            age : age
        })
        console.log(age)
    }

    setPassword(password){
        this.setState({
            password : password
        })
        
    }

    setConfirmPassword(confirmPassword){
        this.setState({
            confirmPassword : confirmPassword
        })
        
    }


    onFooterLinkPress =() =>{
        this.props.navigation.navigate('Login')
    }

    onRegisterPress(){
        if (this.state.password !== this.state.confirmPassword) {
            alert("Passwords don't match.")
            return
        }
        if(this.state.height === '' || this.state.weight === '' || this.state.age === ''){
            alert("missing parameters")
            return
        }
        firebase
            .auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((response) => {
                const uid = response.user.uid
                const data = {
                    id: uid,
                    email : this.state.email,
                    fullName : this.state.fullName,
                    age : this.state.age,
                    weight : this.state.weight,
                    height : this.state.height,
                    runs : 0
                    
                };
                firebase.firestore().collection('users').doc(uid).set(data).then(() => {
                        this.props.changeLogin(data)
                        //this.props.navigation.navigate('Home')
                    })
                    .catch((error) => {
                        alert(error)
                    });
            })
            .catch((error) => {
                alert(error)
            });
    }
    render() {
        return (
            <View style={styles.container}>
                
                <KeyboardAwareScrollView
                    style={{ flex: 1, width: '100%' }}
                    keyboardShouldPersistTaps="always">
                    {/* <Image
                        style={styles.logo}
                        source={require('../../../assets/icon.png')}
                    />  */}
                    <Text style ={styles.title}>MobileApp</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Full Name'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => this.setFullName(text)}
                        value={this.state.fullName}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
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
                        placeholder='Age'
                        placeholderTextColor="#aaaaaa"
                        keyboardType = 'numeric'
                        onChangeText={(number) => this.setAge(number)}
                        value={this.state.Age}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Height in cm'
                        placeholderTextColor="#aaaaaa"
                        keyboardType = 'numeric'
                        onChangeText={(number) => this.setHeight(number)}
                        value={this.state.height}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Weight in kg'
                        placeholderTextColor="#aaaaaa"
                        keyboardType = 'numeric'
                        onChangeText={(number) => this.setWeight(number)}
                        value={this.state.weight}
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
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        secureTextEntry
                        placeholder='Confirm Password'
                        onChangeText={(text) => this.setConfirmPassword(text)}
                        value={this.state.confirmPassword}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.onRegisterPress()}>
                        <Text style={styles.buttonTitle}>Create account</Text>
                    </TouchableOpacity>
                    <View style={styles.footerView}>
                        <Text style={styles.footerText}>Already got an account? <Text onPress={this.onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    const { login } = state
    return { login }
}

function mapDispatchToProps(dispatch) {
    return {
        changeLogin : (user) => dispatch({type:'LOGGED_IN', payload : user})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(RegistrationScreen);
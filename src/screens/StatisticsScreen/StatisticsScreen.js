import React,{Component}  from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import { firebase } from '../../firebase/config';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import { getStepCountAsync } from 'expo-sensors/build/Pedometer';
import { prototype } from 'react-native/Libraries/Image/ImageBackground';
import { ImageType } from 'expo-camera/build/Camera.types';
import styles from './styles';

  

class StatisticsScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            stats : null
        }
        
    }

    setStats(stats){
        this.setState({
            stats : stats
        })
    }
    async getStats(){
        const id = this.props.login.user.id
        
        const snapshot = await firebase.firestore().collection('Data').doc(id).collection('Runs').get()
        .catch((error) => {
            alert(error)
        });
     
        this.setStats(snapshot.docs.map(doc => doc.data()))
    }

    componentDidMount(){
        this.getStats()
        
    }

    renderItem( item ){ 
        <Item title = {item} />
    }

    calculateDate(time){
        let t = new Date(time * 1000).toLocaleString()
        console.log(t)
        return t;
    }

    render() {

        return (
            
            <View>
            {this.state.stats === null ? (
                <Text>Loading....</Text>
                
            ):(
                <FlatList
                data={ this.state.stats }
                renderItem={({ item }) => (
                    <View style={styles.container}>
                        <Text style={styles.item}>Date : {this.calculateDate(item.exercise.date.seconds)}</Text>
                        <Text style={styles.item}>Time : {item.exercise.timemin}m {item.exercise.timesec}s</Text>
                        <Text style={styles.item}>Distance : {item.exercise.distance}</Text>
                        <Text style={styles.item}>Calories : {item.exercise.calories}</Text>   
                    </View>
                )}
                keyExtractor = {item => item.exercise.date.seconds}
                />
            )}
            </View>
        );
    }
 
 }

const mapStateToProps = (state) => {
    console.log(state)
    const { login } = state
    return { login }
}

export default connect(mapStateToProps)(StatisticsScreen);
import React, { Component } from "react";
import { View, Text, Button, Touchable, ActivityIndicatorComponent } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as TaskManager from "expo-task-manager";;
import * as geolib from 'geolib';
import { connect } from 'react-redux';



const LOCATION_TASK_NAME = "background-location-task";
var location  = ''

import { firebase } from '../../firebase/config';
import styles from './styles';
import { TouchableOpacity } from "react-native-gesture-handler";
import { set } from "react-native-reanimated";


class ExerciseScreen extends Component {

  constructor(props) {
    super(props);
    this._isMounted = true
    this.state = {
      shouldShow: false,
      selectedTab: 'A',
      region: null,
      error: '',
      distance: 0,
      time: 0,
      hour: 0,
      min: 0,
      sec: 0,
      msec: 0,
      speed: 0,
      calories: 0,
      start: false,
      coordinatesarr: [],
      latlngarr: [],
      stopwatchInterval: 0,
      prevTime : 0,
      elapsedTime : 0


    };

    this.interval = null;
  }

  setCalories(calories){
    this.setState({
      calories : calories
    })
  }

  setSpeed(speed){
    this.setState({
      speed : speed
    })
  }

  updateTime(){
    let tempTime = this.state.elapsedTime;
    this.state.msec = Math.floor(tempTime % 1000 / 100);
    tempTime = Math.floor(tempTime / 1000);
    this.state.sec =tempTime % 60;
    tempTime = Math.floor(tempTime / 60);
    this.state.min =tempTime % 60;
    tempTime = Math.floor(tempTime / 60);
    this.state.hour = tempTime % 60;
    this.setState({
      time : this.state.hour + " : " + this.state.min + " : " + this.state.sec + "." + this.state.msec
    })
  }

  uploadToFirebase(){
    this.props.login.user.runs =this.props.login.user.runs + 1;
    let  runsCount = this.props.login.user.runs
    const exercise = {
      distance : this.state.distance,
      timemin : this.state.min,
      timesec : this.state.sec,
      calories : this.state.calories,
      date : firebase.firestore.Timestamp.fromDate(new Date())
    }
    console.log(this.props.login.user)
    firebase.firestore().collection('users').doc(this.props.login.user.id).update({ runs : firebase.firestore.FieldValue.increment(1)});
    firebase.firestore().collection('Data').doc(this.props.login.user.id).collection('Runs').doc(runsCount.toString()).set({ exercise });
    
    
  }

  endExercise = () => {
    this.uploadToFirebase() 
    this.state.shouldShow = !this.state.shouldShow
    this.setSpeed(0)
    clearInterval(this.state.stopwatchInterval);
    this.setState({
      stopwatchInterval : null
    })
    this.state.coordinatesarr.forEach(element => {
      let latlng = {
        latitude: element.latitude,
        longitude: element.longitude
      }
      this.state.latlngarr.push(latlng)
    });
    this.setState({
      /* latlngarr : [],
      coordinatesarr : [], */
      speed : 0,

    })
    this.state.coordinatesarr = []
    this.setTab('C')
  }

  startEx = () => {
    this.state.shouldShow = !this.state.shouldShow
    this.setTab('B')
    this.state.start = true
    this.startTime()
  }

  startTime = () =>{
    if(!this.state.stopwatchInterval){
      this.state.stopwatchInterval = setInterval(() => {
        if(!this.state.prevTime){
          this.state.prevTime = Date.now()
        } 
        this.state.elapsedTime += Date.now() - this.state.prevTime;
        this.state.prevTime = Date.now()
        this.updateTime();
      }, 100);
    }
  }


  handleToggle = () => {
    this.handleStart()
    this.setState(
      {
        start : !this.state.start
      }
    );
  };

  handleStart = () =>{
    if (this.state.start) {
      clearInterval(this.state.stopwatchInterval);
      this.state.stopwatchInterval = null;
      this.state.prevTime = null;
    } else {
      this.startTime();
    }
    

  }
  calculateSpeed(){
    let lastcoord = this.state.coordinatesarr.slice(-1).pop()
    let speed = lastcoord["speed"]
    speed = Math.round((speed + Number.EPSILON) * 100) / 100
    this.setState({
      speed : speed
    })
  }

  calculateCalories(){
    let age = this.props.login.user.age
    let height = this.props.login.user.height
    let weight = this.props.login.user.weight
    let time = (this.state.min * 60) + this.state.sec
    let burnedCals = Math.round((this.state.distance / 1000)* weight * 1.036)
    this.setCalories(burnedCals)

  }

  calculateDistance() {
    let lengthtmp = this.state.coordinatesarr.length
    let coordinates = this.state.coordinatesarr
    if (lengthtmp > 1) {
      this.state.distance += geolib.getDistance({
        latitude: coordinates[lengthtmp - 1].latitude,
        longitude: coordinates[lengthtmp - 1].longitude
      },
        {
          latitude: coordinates[lengthtmp - 2].latitude,
          longitude: coordinates[lengthtmp - 2].longitude
        }, 1)
    }
  }

  backToMenu(){
    this.setSpeed(0)
    this.setCalories(0)
    this.props.navigation.navigate('Home')
  }

  _getLocationAsync = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      enableHighAccuracy: true,
      distanceInterval: 1,
      timeInterval: 2000,
      accuracy: 6,
      foregroundService : {
        notificationTitle : "MobileApp",
        notificationBody: "Running"
      }
    });
    // watchPositionAsync Return Lat & Long on Position Change
    location = await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        distanceInterval: 1,
        timeInterval: 2000,
        accuracy : 5
      },
      newLocation => {
        let { coords } = newLocation;
        this.state.coordinatesarr.push(coords)
        this.calculateDistance();
        this.calculateSpeed();
        this.calculateCalories()
        let region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        };
        this.setState({ region: region });
      },
      error => console.log(error)
    );
    return this.location;
  };



  async componentDidMount() {
    // Asking for device location permission
    if (this._isMounted === true) { 
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === "granted") {
      this._getLocationAsync();
    } else {
      this.setState({ error: "Locations services needed" });
    }
  }
  }
  // nem tudom, hogy jo e
  componentWillUnmount() {
    this._isMounted === false
    Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    this.setSpeed(0)
    this.setCalories(0)
  }

  stopSignal = (childData) => {
    this.setState({ shouldShow: childData })
  }

  setTab = (tab) => {
    this.setState({ selectedTab: tab })
  }

  selectedTab = () => {
    switch (this.state.selectedTab) {
      case 'A':
        return <View style={styles.container}>
          <MapView style={styles.map}
            showsCompass={true}
            showsUserLocation={true}
            rotateEnabled={true}
            region={this.state.region}
          />
          <TouchableOpacity title='Start' style={styles.button} onPress={this.startEx} ><Text style={styles.buttonTitle}>Start</Text></TouchableOpacity>
          </View>
      case 'B':
        return <View style={styles.container}>
          <MapView style={styles.map}
            showsCompass={true}
            showsUserLocation={true}
            rotateEnabled={true}
            region={this.state.region}
          />
          <Text style={styles.timer}>{this.state.time}</Text>
          <Text style={styles.distance}>{"Distance: " + this.state.distance + "m"}</Text>
          <View style={styles.rowview}>
          <Text style={styles.distance}>{"Speed: " + this.state.speed}</Text>
          </View>
          <View style={styles.rowview}>
            <TouchableOpacity style={styles.button} title={this.state.start ? 'Pause' : 'Continue'}
              onPress={this.handleToggle}><Text style={styles.buttonTitle}>{this.state.start ? 'Pause' : 'Continue'}</Text></TouchableOpacity>
            <TouchableOpacity title='Stop' style={styles.button} onPress={this.endExercise}><Text style={styles.buttonTitle}>Stop</Text></TouchableOpacity>
          </View>
        </View>
      case 'C':
        return <View style={styles.container}>
          <MapView style={styles.map}
            showsCompass={true}
            rotateEnabled={true}
            region={this.state.region}
          >
            <Polyline coordinates={
              this.state.latlngarr}
              strokeColor='#263BEB'
              strokeWidth={6}
            />
          </MapView>
          <Text style={styles.distance}>{"Distance: " + this.state.distance + "m"}</Text>
          <Text style={styles.distance}>{"Calories burnt: " + this.state.calories}</Text>
          <TouchableOpacity title='toMenu' style={styles.button} onPress={() => this.backToMenu()}><Text style={styles.buttonTitle}>Menu</Text></TouchableOpacity>
        </View>
      default:
        return <View> </View>

    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.selectedTab()}
      </View>

    )

  }
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    console.log(data)
    location
  }
  
});

const mapStateToProps = (state) => {
  const { login } = state
  return { login }
}

export default connect(mapStateToProps)(ExerciseScreen);
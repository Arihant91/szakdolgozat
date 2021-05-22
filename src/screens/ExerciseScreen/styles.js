import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from "react-native/Libraries/NewAppScreen";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowbutton: {
    color: Colors.dark
  } ,
  rowview: {
    flex: 1,
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }, 
  timer: {
    fontSize: 30,
  },
  distance : {
    fontSize: 24,
    padding: 10,
  },
  map: {
    width: Dimensions.get('window').width,
    height: 300,
  },
  button: {
    backgroundColor: '#34c0eb',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    padding: 20,
    paddingHorizontal: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonTitle: {
    color: 'green',
    fontSize: 16,
    fontWeight: "bold"
  },
    
  });
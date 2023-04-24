import { StyleSheet } from 'react-native';

const colors = {
  white: 'white',
  red: '#ED4A5F',
  healthGray: '#EDEDED',
  border: '#C2E9FF',

  enemyLoomiesContainer: '#E8E8E8',
  loomieActive: '#31B5FF',
  loomieOFF: '#8D8D8D'
};

const HEADER_HEIGHT = -160 + 220 + 7;
const TOP_HEIGHT = 0;
const BOTTOM_HEIGHT = 0;

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'teal'
  },

  scene: {
    width: '100%',
    height: '100%'
  },

  // header

  circle: {
    height: 220,
    width: 230,
    borderRadius: 200,
    backgroundColor: colors.red,
    position: 'absolute',
    top: -160,
    transform: [{ scaleX: 2 }]
  },

  title: {
    position: 'absolute',
    top: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },

  subtitle: {
    position: 'absolute',
    top: 32,
    fontSize: 14,
    color: 'white'
  },

  bubbleBig: {
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    backgroundColor: colors.red,
    borderRadius: 200
  },

  bubbleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },

  // top

  top: {
    width: '100%',
    top: HEADER_HEIGHT,
    position: 'absolute'
  },

  // bottom

  bottom: {
    // backgroundColor: 'blue',
    position: 'absolute',
    bottom: 0,

    width: '100%'
    //height: 100,
  },

  stack: {
    width: '100%',
    height: 50
  },

  centerVertically: {
    //backgroundColor: 'red',
    height: '100%',
    width: '100%',

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  alignRight: {
    //backgroundColor: 'pink',
    position: 'absolute',
    right: 0,
    flexDirection: 'row',

    height: '100%',
    width: 'auto'
  },

  alignLeft: {
    //backgroundColor: 'pink',
    position: 'absolute',
    left: 0,
    flexDirection: 'row',

    height: '100%',
    width: 1
  },

  bubbleEscape: {
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 55,

    backgroundColor: '#00000022',
    borderRadius: 200
  },

  // loomie info

  loomieInfoContainer: {
    borderWidth: 3,
    borderColor: colors.border,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginHorizontal: 5,

    backgroundColor: 'white',
    width: '100%',
    height: '100%',

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  infoText: {
    color: 'black',
    fontSize: 15
  },

  healthText: {
    color: 'gray',
    //color: colors.red,
    fontSize: 12
  },

  healthBackground: {
    borderWidth: 2,
    borderColor: colors.border,

    width: '100%',
    backgroundColor: colors.healthGray,
    height: 15
  },

  health: {
    backgroundColor: colors.red,
    height: '100%'
  },

  // remaining enemy loomies

  enemyLoomiesContainer: {
    marginHorizontal: 5,
    borderWidth: 3,
    borderColor: colors.border,
    borderRadius: 8,

    backgroundColor: colors.enemyLoomiesContainer,
    width: '50%',
    height: 32,
    marginTop: 5
  },

  enemyLoomiesContainer2: {
    flexDirection: 'row',
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center'
  },

  loomieDiamond: {
    borderWidth: 3,
    borderColor: colors.border,

    width: 18,
    height: 18,
    transform: [{ rotate: '45deg' }]
  },

  loomieON: {
    backgroundColor: colors.red
  },

  loomieActive: {
    backgroundColor: colors.loomieActive
  },

  loomieOFF: {
    backgroundColor: colors.loomieOFF
  },

  // middle (inputs)

  middle: {
    //backgroundColor: 'green',
    position: 'absolute',
    top: HEADER_HEIGHT + 140,
    bottom: HEADER_HEIGHT + 100,
    flexGrow: 1,
    width: '100%',
    flexDirection: 'row'
  },

  inputDodge: {
    //backgroundColor: 'blue'
    width: '20%'
  },

  gameMessagesContainer: {
    //backgroundColor: 'purple',
    position: 'absolute',
    top: HEADER_HEIGHT + 115,
    bottom: HEADER_HEIGHT + 100,
    flexGrow: 1,
    width: '100%',
    flexDirection: 'row'
  }
});
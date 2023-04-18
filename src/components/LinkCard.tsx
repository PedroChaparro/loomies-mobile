import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface IProps {
  displayText: string;
  iconName: string;
  callback: () => void;
}

export const LinkCard = ({ iconName, displayText, callback }: IProps) => {
  return (
    <TouchableWithoutFeedback onPress={callback}>
      <View style={Styles.viewTouchable}>
        <View style={Styles.groupIconText}>
          <FeatherIcon name={iconName} size={20} color={'#5c5c5c'} />
          <Text style={Styles.linkText}>{displayText}</Text>
        </View>
        <FeatherIcon name={'chevron-right'} size={20} color={'#5c5c5c'} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const Styles = StyleSheet.create({
  groupIconText: {
    alignSelf: 'center',
    flexDirection: 'row'
  },
  linkText: {
    color: '#5c5c5c',
    marginLeft: 12
  },
  viewTouchable: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 4,
    paddingLeft: 8,
    width: '80%',
    backgroundColor: '#f2f1ed',
    justifyContent: 'space-between',
    height: 42,
    borderRadius: 4
  }
});

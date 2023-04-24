import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { CustomButton } from '@src/components/CustomButton';

interface IProps {
  isVisible: boolean;
  toggleVisibility: () => void;

  title: string;
  description: string;

  labelOk?: string;
  labelCancel?: string;

  callbackOk: () => void;
  callbackCancel?: () => void;
}

export const GenericModal = ({
  isVisible,
  toggleVisibility,

  title,
  description,

  labelOk,
  labelCancel,

  callbackOk,
  callbackCancel
}: IProps) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={toggleVisibility}>
      <View style={Styles.container}>
        <View style={Styles.background}>
          <Text style={{ ...Styles.modalText, ...Styles.textTitle }}>
            {title}
          </Text>
          <Text style={{ ...Styles.modalText, ...Styles.textDescription }}>
            {description}
          </Text>
          <CustomButton
            title={labelOk ? labelOk : 'Ok'}
            type='primary'
            callback={callbackOk}
          />
          {callbackCancel && (
            <CustomButton
              title={labelCancel ? labelCancel : 'Cancel'}
              type='bordered'
              callback={callbackCancel}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  background: {
    width: '80%',
    padding: 16,
    backgroundColor: 'white'
  },
  modalText: {
    color: '#5C5C5C'
  },
  textTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8
  },
  textDescription: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 8
  }
});

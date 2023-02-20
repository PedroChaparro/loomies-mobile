import Toast from 'react-native-toast-message';

export const useToastAlert = () => {
  const showSuccessToast = (message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Success:',
      text2: message,
      topOffset: 30,
      visibilityTime: 2000
    });
  };

  const showErrorToast = (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Error:',
      text2: message,
      topOffset: 30,
      visibilityTime: 2000
    });
  };

  const showInfoToast = (message: string) => {
    Toast.show({
      type: 'info',
      text1: 'Info:',
      text2: message,
      topOffset: 30,
      visibilityTime: 2000
    });
  };

  return { showSuccessToast, showErrorToast, showInfoToast };
};

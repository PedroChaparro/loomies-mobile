import React, { useEffect, useState } from 'react';
import { getLoomiesRequest } from '@src/services/user.services';
import { TCaughtLoomies } from '@src/types/types';
import { LoomiesGrid } from '@src/components/CaughtLoomiesGrid/LoomiesGrid';
import { Container } from '@src/components/Container';
import { LoomiesGridSkeleton } from '@src/skeletons/CaughtLoomiesGrid/LoomiesGridSkeleton';
import { NavigationProp } from '@react-navigation/native';
import { EmptyMessage } from '@src/components/EmptyMessage';
import { Pressable, StyleSheet } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
}

export const UserLoomies = ({ navigation }: IProps) => {
  const [loomies, setLoomies] = useState(Array<TCaughtLoomies>);
  const [loading, setLoading] = useState(true);

  // Request to obtain the loomies
  const fetchLoomies = async () => {
    const [response, err] = await getLoomiesRequest();

    if (!err) {
      const { loomies } = response;
      setLoomies(loomies || []);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoomies();
  }, []);

  // Function to redirect to the map view in case the user doesn't have any loomies
  const goToMap = () => {
    navigation.navigate('Map');
  };

  const goToLoomieTeam = () => {
    navigation.navigate('UpdateLoomieTeam');
  };

  // Function to render the loomies or show a message if there are no loomies
  const renderLoomies = () => {
    if (!loading && loomies.length === 0)
      return (
        <EmptyMessage
          text="You don't have any Loomies yet..."
          showButton={true}
          buttonText={'Catch Loomies'}
          buttonCallback={goToMap}
        />
      );

    return (
      <>
        <LoomiesGrid loomies={loomies} />
        {/* Button to redirect the user to the Loomie Team selection */}
        <Pressable style={Styles.floatingButton} onPress={goToLoomieTeam}>
          <MaterialCommunityIcon name='sword' size={32} color={'white'} />
        </Pressable>
      </>
    );
  };

  return (
    <Container>{loading ? <LoomiesGridSkeleton /> : renderLoomies()}</Container>
  );
};

const Styles = StyleSheet.create({
  /* Ideally the position of this button should be fixed,
  but in react native the position: 'fixed' attribute doesn't
  exists. This couldn't be done as in the Map View because
  the height of this view isn't fixed. */
  floatingButton: {
    marginVertical: 12,
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ED4A5F',
    alignSelf: 'center',
    borderRadius: 50
  }
});

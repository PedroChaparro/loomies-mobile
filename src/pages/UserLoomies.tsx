import React, { useEffect, useState } from 'react';

import {
  getLoomieTeamService,
  getLoomiesRequest
} from '@src/services/loomies.services';
import { TCaughtLoomies, TCaughtLoomieToRender } from '@src/types/types';
import { LoomiesGrid } from '@src/components/CaughtLoomiesGrid/LoomiesGrid';
import { Container } from '@src/components/Container';
import { LoomiesGridSkeleton } from '@src/skeletons/CaughtLoomiesGrid/LoomiesGridSkeleton';
import { NavigationProp, useIsFocused } from '@react-navigation/native';
import { EmptyMessage } from '@src/components/EmptyMessage';
import { View } from 'react-native';
import { FloatingRedIcon } from '@src/components/FloatingRedIcon';

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
}

export const UserLoomies = ({ navigation }: IProps) => {
  const isFocused = useIsFocused();
  const [loomies, setLoomies] = useState(Array<TCaughtLoomieToRender>);
  const [team, setTeam] = useState(Array<string>);
  const [loading, setLoading] = useState(true);

  // Request to obtain the loomies
  const fetchLoomies = async () => {
    const [response, err] = await getLoomiesRequest();

    if (!err) {
      const loomies: TCaughtLoomies[] = response.loomies;

      const loomiesWithTeamProperty = loomies.map((loomie) => ({
        ...loomie,
        is_in_team: team.includes(loomie._id)
      }));

      setLoomies(loomiesWithTeamProperty || []);
      setLoading(false);
    }
  };

  const fetchLoomieTeam = async () => {
    const [response, err] = await getLoomieTeamService();
    if (err) return;
    const team: Array<TCaughtLoomieToRender> = response.team;
    setTeam(team.map((loomie) => loomie._id));
  };

  // First we get the loomie team
  useEffect(() => {
    if (!isFocused) return;
    fetchLoomieTeam();
  }, [isFocused]);

  // When the team is obtained, we get the loomies
  useEffect(() => {
    fetchLoomies();
  }, [team]);

  // Function to redirect to the map view in case the user doesn't have any loomies
  const goToMap = () => {
    navigation.navigate('Map');
  };

  const goToLoomieTeam = () => {
    navigation.navigate('UpdateLoomieTeam');
  };

  const goToDetails = (loomieId: string) => {
    const loomie = loomies.find((loomie) => loomie._id === loomieId);
    if (!loomie) return;
    navigation.navigate('LoomieDetails', { loomie });
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
      <LoomiesGrid
        loomies={loomies}
        markBusyLoomies={false}
        markSelectedLoomies={false}
        elementsCallback={goToDetails}
      />
    );
  };

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      <Container>
        {loading ? <LoomiesGridSkeleton /> : renderLoomies()}
      </Container>
      {/* Floating button to update the loomie team */}
      {!loading && loomies.length > 0 && (
        <FloatingRedIcon
          onPress={goToLoomieTeam}
          collection='MaterialCommunityIcons'
          name='sword'
          bottom={16}
          right={16}
        />
      )}
    </View>
  );
};

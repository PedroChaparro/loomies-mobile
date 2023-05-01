import {
  getLoomieTeamService,
  putLoomieTeam,
  getLoomiesRequest
} from '@src/services/loomies.services';
import { TCaughtLoomies, TCaughtLoomieToRender } from '@src/types/types';
import React, { useEffect, useState } from 'react';
import { LoomiesGrid } from '@src/components/CaughtLoomiesGrid/LoomiesGrid';
import { Container } from '@src/components/Container';
import { NavigationProp, useIsFocused } from '@react-navigation/native';
import { LoomiesGridSkeleton } from '@src/skeletons/CaughtLoomiesGrid/LoomiesGridSkeleton';
import { Pressable, StyleSheet, View } from 'react-native';
import { useToastAlert } from '@src/hooks/useToastAlert';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any>;
}

export const UpdateLoomieTeamView = ({ navigation }: IProps) => {
  const { showErrorToast, showSuccessToast } = useToastAlert();
  const [loomies, setLoomies] = useState(Array<TCaughtLoomieToRender>);
  const [team, setTeam] = useState(Array<string>);
  const [loading, setLoading] = useState(true);
  const focused = useIsFocused();

  const getLoomieTeam = async () => {
    const [response, error] = await getLoomieTeamService();
    if (error) return;

    const loomies = response.team;
    const ids = loomies.map((loomie: TCaughtLoomies) => loomie._id);
    setTeam(ids);
  };

  const getLoomies = async () => {
    let currentLoomies: TCaughtLoomies[];

    // Get the loomies from the database the first time
    if (!loomies || loomies.length === 0) {
      const [response, error] = await getLoomiesRequest();
      if (error || !response.loomies || response.loomies.length == 0) return;

      const responseLoomies: TCaughtLoomies[] = response.loomies;
      currentLoomies = responseLoomies;
    } else {
      currentLoomies = loomies;
    }

    const loomiesWithTeamProperty = currentLoomies.map((loomie) => {
      const isTeamLoomie = team.includes(loomie._id);
      return {
        ...loomie,
        is_in_team: isTeamLoomie,
        is_selected: isTeamLoomie
      };
    });

    setLoomies(loomiesWithTeamProperty);
    setLoading(false);
  };

  // First, get the team, then get the loomies
  useEffect(() => {
    if (!focused) return;
    getLoomieTeam();
  }, [focused]);

  // When the team is obtained, we get the loomies
  useEffect(() => {
    getLoomies();
  }, [team]);

  const handleLoomiePress = (loomieId: string) => {
    // If the loomie is busy, ignore the action
    const loomie = loomies.find((loomie) => loomie._id === loomieId);
    if (!loomie || loomie.is_busy) return;

    if (team.includes(loomieId)) {
      // If the loomie is already in the team, remove it
      const newTeam = team.filter((id) => id !== loomieId);
      setTeam(newTeam);
      return;
    } else if (team.length >= 6) {
      // If the team is full, remove the first loomie and add the new one
      const newTeam = [...team.slice(1), loomieId];
      setTeam(newTeam);
    } else {
      // If the loomie is not in the team, add it
      const newTeam = [...team, loomieId];
      setTeam(newTeam);
    }
  };

  const handleSave = async () => {
    if (team.length == 0) {
      showErrorToast('You must select at least one loomie to save your team');
      return;
    } else if (team.length > 6) {
      showErrorToast('You can only select up to 6 loomies');
      return;
    }

    const [response, error] = await putLoomieTeam(team);

    if (error) {
      showErrorToast(
        response['message'] ||
          'There was an error saving your team, please try again later'
      );
    } else {
      showSuccessToast(
        response['message'] || 'Your team was saved successfully'
      );

      navigation.navigate('Application', { screen: 'LoomieTeamView' });
    }
  };

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      <Container>
        {loading ? (
          <LoomiesGridSkeleton />
        ) : (
          <LoomiesGrid
            loomies={loomies}
            markBusyLoomies={true}
            markSelectedLoomies={true}
            elementsCallback={handleLoomiePress}
          />
        )}
      </Container>
      {!loading && loomies.length > 0 && (
        <Pressable style={Styles.floatingButton} onTouchEnd={handleSave}>
          <MaterialCommunityIcon name='content-save' size={36} color='white' />
        </Pressable>
      )}
    </View>
  );
};

const Styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#ED4A5F',
    padding: 8,
    borderRadius: 50
  }
});

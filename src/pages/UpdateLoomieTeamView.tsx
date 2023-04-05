import {
  getLoomieTeamService,
  getLoomiesRequest,
  putLoomieTeam
} from '@src/services/user.services';
import { TCaughtLoomies, TCaughtLoomiesWithTeam } from '@src/types/types';
import React, { useEffect, useState } from 'react';
import { LoomiesGrid } from '@src/components/CaughtLoomiesGrid/LoomiesGrid';
import { Container } from '@src/components/Container';
import { useIsFocused } from '@react-navigation/native';
import { LoomiesGridSkeleton } from '@src/skeletons/CaughtLoomiesGrid/LoomiesGridSkeleton';
import { CustomButton } from '@src/components/CustomButton';
import { View } from 'react-native';
import { useToastAlert } from '@src/hooks/useToastAlert';

export const UpdateLoomieTeamView = () => {
  const { showErrorToast, showSuccessToast } = useToastAlert();
  const [loomies, setLoomies] = useState(Array<TCaughtLoomiesWithTeam>);
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
    const [response, error] = await getLoomiesRequest();
    if (error) return;

    const loomies: TCaughtLoomies[] = response.loomies;
    const loomiesWithTeamProperty = loomies.map((loomie) => ({
      ...loomie,
      is_in_team: team.includes(loomie._id)
    }));

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
    }
  };

  const redirectionHeader = (
    <View style={{ paddingHorizontal: 10 }}>
      <CustomButton title='Save' type='primary' callback={handleSave} />
    </View>
  );

  return (
    <Container>
      {loading ? (
        <LoomiesGridSkeleton />
      ) : (
        <LoomiesGrid
          loomies={loomies}
          markBusyLoomies={true}
          markTeamLoomies={true}
          elementsCallback={handleLoomiePress}
          listHeaderComponent={redirectionHeader}
        />
      )}
    </Container>
  );
};

import {
  getLoomieTeamService,
  getLoomiesRequest
} from '@src/services/user.services';
import { TCaughtLoomieToRender, TCaughtLoomies } from '@src/types/types';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { LoomiesGrid } from '../CaughtLoomiesGrid/LoomiesGrid';

interface IProps {
  selectedLoomie: TCaughtLoomieToRender;
  isVisible: boolean;
  toggleVisibilityCallback: () => void;
}

export const FuseLoomiesModal = ({
  selectedLoomie,
  isVisible,
  toggleVisibilityCallback
}: IProps) => {
  const [team, setTeam] = useState<string[]>([]);
  const [loomies, setLoomies] = useState<TCaughtLoomieToRender[]>();

  // Request to obtain the loomies
  const fetchLoomies = async () => {
    const [response, err] = await getLoomiesRequest();
    if (err) return;

    const loomies: TCaughtLoomies[] = response.loomies;

    const loomiesWithTeamProperty = loomies.map((loomie) => {
      const isTeamLoomie = team.includes(loomie._id);

      return {
        ...loomie,
        is_in_team: isTeamLoomie,
        is_selected: isTeamLoomie
      };
    });

    // Filter loomies to show only the ones that can be fused
    const fuseCandidates = loomiesWithTeamProperty.filter((loomie) => {
      return (
        loomie._id !== selectedLoomie._id &&
        loomie.serial === selectedLoomie.serial &&
        !loomie.is_busy
      );
    });

    setLoomies(fuseCandidates);
  };

  // Request to obtain the team
  const fetchLoomieTeam = async () => {
    const [response, err] = await getLoomieTeamService();
    if (err) return;
    const team: Array<TCaughtLoomieToRender> = response.team;
    setTeam(team.map((loomie) => loomie._id));
  };

  // First, get the team, then get the loomies
  useEffect(() => {
    fetchLoomieTeam();
  }, []);

  useEffect(() => {
    fetchLoomies();
    console.log('Loomies were fetched');
  }, [team]);

  const handleLoomiePress = useCallback((loomieId: string) => {
    console.log('Loomie pressed: ', loomieId);
  }, []);

  if (!loomies) return <Text>Loading...</Text>;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={toggleVisibilityCallback}
      onBackButtonPress={toggleVisibilityCallback}
      style={{ backgroundColor: 'red' }}
    >
      <View style={{ flex: 1 }}>
        <LoomiesGrid
          loomies={loomies}
          markBusyLoomies={false}
          markSelectedLoomies={true}
          elementsCallback={handleLoomiePress}
        />
      </View>
    </Modal>
  );
};

import {
  getLoomieTeamService,
  getLoomiesRequest
} from '@src/services/user.services';
import { TCaughtLoomies, TCaughtLoomiesWithTeam } from '@src/types/types';
import React, { useEffect, useState } from 'react';
import { LoomiesGrid } from '@src/components/CaughtLoomiesGrid/LoomiesGrid';
import { Container } from '@src/components/Container';
import { useIsFocused } from '@react-navigation/native';
import { LoomiesGridSkeleton } from '@src/skeletons/CaughtLoomiesGrid/LoomiesGridSkeleton';

export const UpdateLoomieTeamView = () => {
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

  const handleLoomiePress = (loomieId: string) => {
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

  // First, get the team, then get the loomies
  useEffect(() => {
    if (!focused) return;
    getLoomieTeam();
  }, [focused]);

  // When the team is obtained, we get the loomies
  useEffect(() => {
    getLoomies();
  }, [team]);

  return (
    <Container>
      {loading ? (
        <LoomiesGridSkeleton />
      ) : (
        <LoomiesGrid loomies={loomies} elementsCallback={handleLoomiePress} />
      )}
    </Container>
  );
};

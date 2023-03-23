import React, { useEffect, useState } from 'react';
import { getLoomiesRequest } from '@src/services/user.services';
import { TCaughtLoomies } from '@src/types/types';
import { LoomiesGrid } from '@src/components/CaughtLoomiesGrid/LoomiesGrid';
import { Container } from '@src/components/Container';
import { LoomiesGridSkeleton } from '@src/skeletons/CaughtLoomiesGrid/LoomiesGridSkeleton';
import { Text } from 'react-native';

export const UserLoomies = () => {
  const [loomies, setLoomies] = useState(Array<TCaughtLoomies>);
  const [loading, setLoading] = useState(true);

  // Request to obtain the loomies
  const fetchLoomies = async () => {
    const [response, err] = await getLoomiesRequest();

    if (!err) {
      const { loomies } = response;
      setLoomies(loomies);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoomies();
  }, []);

  // Function to render the loomies or show a message if there are no loomies
  const renderLoomies = () => {
    if (!loading && loomies.length === 0) return <Text>No loomies yet</Text>;
    return <LoomiesGrid loomies={loomies} />;
  };

  return (
    <Container>{loading ? <LoomiesGridSkeleton /> : renderLoomies()}</Container>
  );
};

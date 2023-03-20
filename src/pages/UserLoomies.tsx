import React, { useEffect, useState } from 'react';
import { getLoomiesRequest } from '@src/services/user.services';
import { TCaughtLoomies } from '@src/types/types';
import { LoomiesGrid } from '@src/components/CaughtLoomiesGrid/LoomiesGrid';
import { Container } from '@src/components/Container';
import { LoomiesGridSkeleton } from '@src/skeletons/CaughtLoomiesGrid/LoomiesGridSkeleton';

export const UserLoomies = () => {
  const [loomies, setLoomies] = useState(Array<TCaughtLoomies>);
  const [loading, setLoading] = useState(true);

  // Request to obtain the loomies
  const fetchLoomies = async () => {
    const [response, err] = await getLoomiesRequest();
    console.log(response);

    if (!err) {
      const { loomies } = response;
      setLoomies(loomies);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoomies();
  }, []);

  return (
    <Container>
      {loading ? <LoomiesGridSkeleton /> : <LoomiesGrid loomies={loomies} />}
    </Container>
  );
};

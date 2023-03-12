import React, { useEffect, useState } from 'react';
import { getLoomiesRequest } from '@src/services/user.services';
import { TCaughtLoomies } from '@src/types/types';
import { LoomiesGrid } from '@src/components/CaughtLoomiesGrid/LoomiesGrid';
import { Container } from '@src/components/Container';

export const UserLoomies = () => {
  const [loomies, setLoomies] = useState(Array<TCaughtLoomies>);

  // Request to obtain the loomies
  const fetchLoomies = async () => {
    const [response, err] = await getLoomiesRequest();

    if (!err) {
      const { loomies } = response;
      setLoomies(loomies);
    }
  };

  useEffect(() => {
    fetchLoomies();
  }, []);

  return (
    <Container>
      <LoomiesGrid loomies={loomies} />
    </Container>
  );
};

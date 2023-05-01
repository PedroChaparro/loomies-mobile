import { TWildLoomies } from '@src/types/types';
import React, { createContext, useEffect, useState } from 'react';

// --------------------------------------------
// We just keep a global state with the required
// data and functions to open/close the modal
// to avoid prop drilling. At this way, the modal
// can access the data and functions without
// passing them as props.
// --------------------------------------------
export const MapModalsContext = createContext({
  currentModalGymId: '',
  currentModalCapturedInfo: null as TWildLoomies | null,
  isGymModalOpen: false,
  isCongratsModalOpen: false,

  toggleGymModalVisibility: () => {
    return;
  },
  toggleCongratsModalVisibility: () => {
    return;
  },
  setCurrentModalGymId: (_id: string) => {
    return;
  },
  setCurrentModalCapturedInfo: (_wildLoomie: TWildLoomies) => {
    return;
  }
});

interface IProps {
  children: React.ReactNode;
}

export const MapModalsProvider = ({ children }: IProps) => {
  const [currentModalGymId, setCurrentModalGymId] = useState('');
  const [currentModalCapturedInfo, setCurrentModalCapturedInfo] =
    useState<TWildLoomies | null>(null);
  const [isGymModalOpen, setIsGymModalOpen] = useState(false);
  const [isCongratsModalOpen, setIsCongratsModalOpen] = useState(false);

  const toggleGymModalVisibility = () => {
    setIsGymModalOpen(!isGymModalOpen);
  };

  const toggleCongratsModalVisibility = () => {
    setIsCongratsModalOpen(!isCongratsModalOpen);
  };

  // If the modal is closed, we reset the current gym id to
  // allow the user to open the same modal again
  useEffect(() => {
    if (!isGymModalOpen) {
      setCurrentModalGymId('');
    }
  }, [isGymModalOpen]);

  // If the current id changes and it's not empty, we open the modal
  useEffect(() => {
    if (currentModalGymId) {
      setIsGymModalOpen(true);
    }
  }, [currentModalGymId]);

  useEffect(() => {
    if (!isCongratsModalOpen) {
      setCurrentModalCapturedInfo(null);
    }
  }, [isCongratsModalOpen]);

  useEffect(() => {
    if (currentModalCapturedInfo) {
      setIsCongratsModalOpen(true);
    }
  }, [currentModalCapturedInfo]);

  return (
    <MapModalsContext.Provider
      value={{
        currentModalGymId,
        currentModalCapturedInfo,
        isGymModalOpen,
        isCongratsModalOpen,
        toggleGymModalVisibility,
        toggleCongratsModalVisibility,
        setCurrentModalGymId,
        setCurrentModalCapturedInfo
      }}
    >
      {children}
    </MapModalsContext.Provider>
  );
};

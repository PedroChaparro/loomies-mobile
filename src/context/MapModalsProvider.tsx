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
  currentGymProtectors: [] as Array<string>,
  currentModalCapturedInfo: null as TWildLoomies | null,
  isGymModalOpen: false,
  isCongratsModalOpen: false,
  isProtectorsModalOpen: false,

  toggleGymModalVisibility: () => {
    return;
  },
  toggleCongratsModalVisibility: () => {
    return;
  },
  toggleProtectorsModalVisibility: (_currentProtectors?: Array<string>) => {
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
  // States
  const [currentModalGymId, setCurrentModalGymId] = useState('');
  const [currentGymProtectors, setCurrentGymProtectors] = useState<string[]>(
    []
  );
  const [currentModalCapturedInfo, setCurrentModalCapturedInfo] =
    useState<TWildLoomies | null>(null);

  // Modals visibility states
  const [isGymModalOpen, setIsGymModalOpen] = useState(false);
  const [isCongratsModalOpen, setIsCongratsModalOpen] = useState(false);
  const [isProtectorsModalOpen, setIsProtectorsModalOpen] = useState(false);

  // Visibility togglers
  const toggleGymModalVisibility = () => {
    setIsGymModalOpen(!isGymModalOpen);
  };

  const toggleCongratsModalVisibility = () => {
    setIsCongratsModalOpen(!isCongratsModalOpen);
  };

  const toggleProtectorsModalVisibility = (currentGymProtectors?: string[]) => {
    if (currentGymProtectors) setCurrentGymProtectors(currentGymProtectors);
    setIsProtectorsModalOpen(!isProtectorsModalOpen);
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
        // Getters
        currentGymProtectors,
        currentModalGymId,
        currentModalCapturedInfo,
        // Visibility states
        isGymModalOpen,
        isCongratsModalOpen,
        isProtectorsModalOpen,
        // Visibility togglers
        toggleGymModalVisibility,
        toggleCongratsModalVisibility,
        toggleProtectorsModalVisibility,
        // Setters
        setCurrentModalGymId,
        setCurrentModalCapturedInfo
      }}
    >
      {children}
    </MapModalsContext.Provider>
  );
};

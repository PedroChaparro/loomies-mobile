import React, { createContext, useEffect, useState } from 'react';

// --------------------------------------------
// We just keep a global state with the required
// data and functions to open/close the modal
// to avoid prop drilling. At this way, the modal
// can access the data and functions without
// passing them as props.
// --------------------------------------------
export const GymsModalContext = createContext({
  currentGymId: '',
  isGymModalOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleGymModalVisibility: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentGymId: (_id: string) => {}
});

interface IProps {
  children: React.ReactNode;
}

export const GymsModalProvider = ({ children }: IProps) => {
  const [currentGymId, setCurrentGymId] = useState('');
  const [isGymModalOpen, setIsGymModalOpen] = useState(false);

  const toggleGymModalVisibility = () => {
    setIsGymModalOpen(!isGymModalOpen);
  };

  useEffect(() => {
    // If a non-empty gym id is set, we open the modal
    if (currentGymId) {
      setIsGymModalOpen(true);
    }
  }, [currentGymId]);

  return (
    <GymsModalContext.Provider
      value={{
        currentGymId,
        isGymModalOpen,
        toggleGymModalVisibility,
        setCurrentGymId
      }}
    >
      {children}
    </GymsModalContext.Provider>
  );
};

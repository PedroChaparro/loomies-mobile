import React, { createContext, useEffect, useState } from 'react';

// --------------------------------------------
// We just keep a global state with the required
// data and functions to open/close the modal
// to avoid prop drilling. At this way, the modal
// can access the data and functions without
// passing them as props.
// --------------------------------------------
export const GymsModalContext = createContext({
  currentModalGymId: '',
  isGymModalOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleGymModalVisibility: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentModalGymId: (_id: string) => {}
});

interface IProps {
  children: React.ReactNode;
}

export const GymsModalProvider = ({ children }: IProps) => {
  const [currentModalGymId, setCurrentModalGymId] = useState('');
  const [isGymModalOpen, setIsGymModalOpen] = useState(false);

  const toggleGymModalVisibility = () => {
    setIsGymModalOpen(!isGymModalOpen);
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

  return (
    <GymsModalContext.Provider
      value={{
        currentModalGymId,
        isGymModalOpen,
        toggleGymModalVisibility,
        setCurrentModalGymId
      }}
    >
      {children}
    </GymsModalContext.Provider>
  );
};

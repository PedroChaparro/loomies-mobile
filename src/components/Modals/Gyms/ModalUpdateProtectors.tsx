import { TCaughtLoomieToRender } from '@src/types/types';
import React, { useState, useContext, useEffect } from 'react';
import { MapModalsContext } from '@src/context/MapModalsProvider';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { getLoomiesRequest } from '@src/services/loomies.services';
import { Title } from '@src/components/Title';
import { EmptyMessage } from '@src/components/EmptyMessage';
import { LoomiesGrid } from '@src/components/CaughtLoomiesGrid/LoomiesGrid';
import { FloatingRedIcon } from '@src/components/FloatingRedIcon';
import { UpdateGymProtectorsService } from '@src/services/gyms.services';
import { useToastAlert } from '@src/hooks/useToastAlert';

export const ModalUpdateProtectors = () => {
  const [loading, setLoading] = useState(true);
  const [loomies, setLoomies] = useState<Array<TCaughtLoomieToRender>>();
  const [protectors, setProtectors] = useState<Array<string>>([]);
  const {
    isProtectorsModalOpen,
    toggleProtectorsModalVisibility,
    toggleGymModalVisibility,
    currentGymProtectors,
    currentModalGymId
  } = useContext(MapModalsContext);
  const { showSuccessToast, showErrorToast } = useToastAlert();

  const getUserLoomies = async () => {
    const [response, err] = await getLoomiesRequest();
    if (err) return;

    // Filter the loomies that are not busy
    const loomies = response['loomies'] as Array<TCaughtLoomieToRender>;
    const availableLoomies = loomies.filter(
      (loomie) => loomie.is_busy === false
    );

    const markedLoomies = availableLoomies.map((loomie) => ({
      ...loomie,
      is_selected: currentGymProtectors.includes(loomie._id)
    }));
    setLoomies(markedLoomies);
    setLoading(false);
  };

  const handleSubmit = async () => {
    const [response, err] = await UpdateGymProtectorsService(
      currentModalGymId,
      protectors
    );

    if (err) {
      showErrorToast(
        response.message || 'There was an error updating the gym protectors'
      );
      return;
    }

    console.log(response);
    showSuccessToast('Gym protectors updated successfully');
    // Hide the current modals to update the UI
    toggleGymModalVisibility();
    toggleProtectorsModalVisibility();
  };

  // Handle the loomie card click event
  const handleLoomieSelection = (loomieId: string) => {
    if (protectors.includes(loomieId)) {
      // Remove the loomie from the protectors array
      const newProtectors = protectors.filter((id) => id !== loomieId);
      setProtectors(newProtectors);
      console.log('Removed');
    } else if (protectors.length === 6) {
      // Remove the first loomie from the protectors array and add the new one
      const newProtectors = protectors.slice(1);
      newProtectors.push(loomieId);
      setProtectors(newProtectors);
      console.log('Replaced');
    } else {
      // Add the loomie to the protectors array
      const newProtectors = [...protectors, loomieId];
      setProtectors(newProtectors);
      console.log('Added');
    }
  };

  // Fetch the user loomies when the modal is opened
  useEffect(() => {
    if (!isProtectorsModalOpen) return;
    getUserLoomies();
  }, [isProtectorsModalOpen]);

  // Update the loomies selectied state when the protectors array changes
  useEffect(() => {
    const newLoomies = loomies?.map((loomie) => ({
      ...loomie,
      is_selected: protectors.includes(loomie._id)
    }));

    setLoomies(newLoomies);
  }, [protectors]);

  const renderLoomies = () => {
    if (loomies?.length === 0 || !loomies) {
      return (
        <EmptyMessage
          text="You don't have any available loomies to protect this gym."
          buttonText='Catch loomies'
          buttonCallback={() => {
            toggleGymModalVisibility();
            toggleProtectorsModalVisibility();
          }}
          showButton={true}
        />
      );
    } else {
      return (
        <LoomiesGrid
          loomies={loomies}
          markBusyLoomies={false}
          markSelectedLoomies={true}
          elementsCallback={handleLoomieSelection}
        />
      );
    }
  };

  return (
    <Modal
      isVisible={isProtectorsModalOpen}
      onBackdropPress={toggleProtectorsModalVisibility}
      backdropOpacity={0.3}
    >
      <View style={Styles.container}>
        <View style={Styles.modalBackground}>
          {loading ? (
            <Text style={Styles.modalText}>Loading...</Text>
          ) : (
            <>
              <Title text='Update gym protectors' />
              {renderLoomies()}
              {/* Action buttons */}
              <FloatingRedIcon
                onPress={handleSubmit}
                collection='MaterialCommunityIcons'
                name='checkbox-marked-circle-outline'
                bottom={80}
                right={16}
              />
              <FloatingRedIcon
                onPress={toggleProtectorsModalVisibility}
                collection='MaterialIcons'
                name='cancel'
                bottom={16}
                right={16}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBackground: {
    width: '96%',
    maxHeight: '95%',
    backgroundColor: 'white',
    padding: 12
  },
  modalText: {
    fontSize: 16,
    color: '#5c5c5c',
    textAlign: 'center'
  }
});

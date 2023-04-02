import { NavigationProp } from '@react-navigation/native';
import { EmptyMessage } from '@src/components/EmptyMessage';
import { ItemGrid } from '@src/components/ItemsGrid/ItemsGrid';
import { getItemsService } from '@src/services/user.services';
import { ItemGridSkeleton } from '@src/skeletons/ItemsGrid/ItemsGridSkeleton';
import { TItem, TLoombal, TInventoryItem } from '@src/types/types';
import React, { useEffect, useState } from 'react';

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
}

export const UserInventory = ({ navigation }: IProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<TItem[]>([]);
  const [loomballs, setLoomballs] = useState<TLoombal[]>([]);
  const [inventory, setInventory] = useState<TInventoryItem[]>([]);

  // Function to redirect to the map view in case the user doesn't have any loomies
  const goToMap = () => {
    navigation.navigate('Map');
  };

  const getInventory = async () => {
    const [response, error] = await getItemsService();
    if (error) return;
    setItems(response.items);
    setLoomballs(response.loomballs);
    setLoading(false);
  };

  useEffect(() => {
    getInventory();
  }, []);

  useEffect(() => {
    if (loading) return;

    // Get the shared properties from the items and loomballs
    const inventory: TInventoryItem[] = [
      ...items.map((item) => ({
        _id: item._id,
        serial: item.serial,
        name: item.name,
        quantity: item.quantity
      })),
      ...loomballs.map((loomball) => ({
        _id: loomball._id,
        serial: loomball.serial,
        name: loomball.name,
        quantity: loomball.quantity
      }))
    ];

    setInventory(inventory);
  }, [loading]);

  if (loading) return <ItemGridSkeleton />;
  if (inventory.length === 0)
    return (
      <EmptyMessage
        text="You don't have any items yet..."
        showButton={true}
        buttonText={'Claim Rewards'}
        buttonCallback={goToMap}
      />
    );

  return <ItemGrid items={inventory} />;
};

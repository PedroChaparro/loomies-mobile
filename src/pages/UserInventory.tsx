import { NavigationProp } from '@react-navigation/native';
import { Container } from '@src/components/Container';
import { EmptyMessage } from '@src/components/EmptyMessage';
import { ItemGrid } from '@src/components/ItemsGrid/ItemsGrid';
import { getItemsService } from '@src/services/items.services';
import { ItemGridSkeleton } from '@src/skeletons/ItemsGrid/ItemsGridSkeleton';
import { TItem, TLoomball, TInventoryItem } from '@src/types/types';
import React, { useEffect, useState } from 'react';

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
}

export const UserInventory = ({ navigation }: IProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<TItem[]>([]);
  const [inventory, setInventory] = useState<TInventoryItem[]>([]);
  const [refresh, setRefresh] = useState(true);

  const refreshPage = () => {
    setRefresh(!refresh);
  };

  // Function to redirect to the map view in case the user doesn't have any loomies
  const goToMap = () => {
    navigation.navigate('Map');
  };

  const getInventory = async () => {
    const response = await getItemsService();
    if (!response) return;
    setItems(response.items);

    const responseItems: TItem[] = response.items;
    const responseLoomballs: TLoomball[] = response.loomballs;

    const mergeInventory: TInventoryItem[] = [
      ...responseItems.map((item) => ({
        _id: item._id,
        type: 'item',
        serial: item.serial,
        name: item.name,
        quantity: item.quantity
      })),
      ...responseLoomballs.map((loomball) => ({
        _id: loomball._id,
        type: 'loomball',
        serial: loomball.serial,
        name: loomball.name,
        quantity: loomball.quantity
      }))
    ];

    setInventory(mergeInventory);

    setLoading(false);
  };

  useEffect(() => {
    getInventory();
  }, [refresh]);

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

  return (
    <Container>
      <ItemGrid inventory={inventory} items={items} refresh={refreshPage} />
    </Container>
  );
};

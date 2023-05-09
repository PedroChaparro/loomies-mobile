import { requestCombatRegister } from '@src/services/combat.services';
import { iPosition } from '@src/types/mapInterfaces';
import { useToastAlert } from '@src/hooks/useToastAlert';

export const getCombatToken = async (
  userPos: iPosition,
  gymId: string
): Promise<string | null> => {
  // try to register combat
  const [data, error] = await requestCombatRegister(userPos, gymId);

  // code 400
  if (error.length) {
    const { showInfoToast } = useToastAlert();

    // show toast
    showInfoToast(error);

    return null;
  }

  // TODO: Show toast when you have to wait for it
  // Maybe it's better to return the error message in that case
  if (!data) return null;

  return data.combat_token;
};

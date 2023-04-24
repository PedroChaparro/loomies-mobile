import { requestCombatRegister } from '@src/services/combat.services';
import { iPosition } from '@src/types/mapInterfaces';
import { iRequestCombatRegister } from '@src/types/requestInterfaces';

export const getCombatToken = async (
  userPos: iPosition,
  gymId: string
): Promise<string | null> => {
  // try to register combat
  const data: iRequestCombatRegister | null = await requestCombatRegister(
    userPos,
    gymId
  );

  // TODO: Show toast when you have to wait for it
  // Maybe it's better to return the error message in that case
  if (!data) return null;

  return data.combat_token;
};

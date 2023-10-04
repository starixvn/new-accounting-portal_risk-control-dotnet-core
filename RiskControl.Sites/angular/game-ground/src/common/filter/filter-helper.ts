import { GameType } from './filter.model';

export const AllProductId = 0;
export const AllGameTypeId = 0;
export const FilterHelper = {
  insertGameTypeAll: insertGameTypeAll
};

function insertGameTypeAll(gameTypes: GameType[]): GameType[] {
  const allGameTypes: GameType[] = [
    {
      typeId: AllGameTypeId,
      gameType: AllGameTypeId,
      typeName: 'All',
      productId: AllProductId
    }
  ];
  return allGameTypes.concat(gameTypes);
}

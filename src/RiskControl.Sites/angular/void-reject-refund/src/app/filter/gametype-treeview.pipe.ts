import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { TreeviewItem } from 'ngx-treeview';
import { ProductId, GameTypeId } from '../common/model';
import { GameType, Product, NumberGameGameType, SportGameType } from './filter.model';

@Pipe({
  name: 'napGametypeTreeview'
})
export class GametypeTreeviewPipe implements PipeTransform {
  private readonly happyFiveLeagueId = 79747;
  private readonly happyFiveLinkedGamesLeagueId = 168;
  private readonly happyFiveMinBetType = 8101;
  private readonly happyFiveMaxBetType = 8120;
  private readonly happyFiveLinkedGamesMinBetType = 3601;
  private readonly happyFiveLinkedGamesMaxBetType = 3610;

  transform(gameTypes: GameType[], products: Product[]): TreeviewItem[] {
    if (_.isNil(gameTypes)) {
      return undefined;
    }

    const items: TreeviewItem[] = [];
    if (_.isNil(products)) {
      return items;
    }

    let otherBetTypes: GameType[] = [];

    const numberGame = this.GetNumberGameBetTypes(gameTypes);
    const numberGameBetTypes = numberGame.numberGameBetTypes;
    const numberGameHappyFiveBetTypes = numberGame.numberGameHappyFiveBetTypes;
    const numberGameHappyFiveLinkedGamesBetTypes = numberGame.numberGameHappyFiveLinkedGamesBetTypes;
    otherBetTypes = _.concat(otherBetTypes, numberGame.otherBetTypes);
    const sabaClub = this.GetProductHaveFreeBetBetTypes(
      gameTypes,
      ProductId.SabaClub,
      GameTypeId.SabaClub,
      GameTypeId.SabaClubFreeBet);
    const sabaClubBetTypes = sabaClub.betTypes;
    const sabaClubFreeBetBetTypes = sabaClub.freeBetBetTypes;
    otherBetTypes = _.concat(otherBetTypes, sabaClub.otherBetTypes);

    const vGaming = this.GetProductHaveFreeBetBetTypes(
      gameTypes,
      ProductId.VGaming,
      GameTypeId.VGaming,
      GameTypeId.VGamingFreeBet);
    const vGamingBetTypes = vGaming.betTypes;
    const vGamingFreeBetBetTypes = vGaming.freeBetBetTypes;
    otherBetTypes = _.concat(otherBetTypes, vGaming.otherBetTypes);

    const otherGameTypes = gameTypes.filter(x =>
      x.productId !== ProductId.NumberGame
      && x.productId !== ProductId.SabaClub
      && x.productId !== ProductId.VGaming);

    otherGameTypes.forEach(gameType => {
      otherBetTypes.push(gameType);
    });

    products.forEach(product => {
      const treeItem = this.MappingProductTreeViewItem(
        product,
        otherBetTypes,
        numberGameBetTypes,
        numberGameHappyFiveBetTypes,
        numberGameHappyFiveLinkedGamesBetTypes,
        sabaClubBetTypes,
        sabaClubFreeBetBetTypes,
        vGamingBetTypes,
        vGamingFreeBetBetTypes);

      items.push(treeItem);
    });

    return items;
  }

  private MappingProductTreeViewItem(
    product: Product,
    otherBetTypes: GameType[],
    numberGameBetTypes: GameType[],
    numberGameHappyFiveBetTypes: GameType[],
    numberGameHappyFiveLinkedGamesBetTypes: GameType[],
    sabaClubBetTypes: GameType[],
    sabaClubFreeBetBetTypes: GameType[],
    vGamingBetTypes: GameType[],
    vGamingFreeBetBetTypes: GameType[]): TreeviewItem {
    const productGameTypes = otherBetTypes.filter(gameType => gameType.productId === product.productId);
    const treeItem = new TreeviewItem({
      text: product.productName,
      value: product.productId
    });

    if (productGameTypes.length === 0) {
      return treeItem;
    }

    this.CreateTreeChildrenItems(
      treeItem,
      product,
      productGameTypes,
      numberGameBetTypes,
      numberGameHappyFiveBetTypes,
      numberGameHappyFiveLinkedGamesBetTypes,
      sabaClubBetTypes,
      sabaClubFreeBetBetTypes,
      vGamingBetTypes,
      vGamingFreeBetBetTypes);

    return treeItem;
  }

  private CreateTreeChildrenItems(treeItem: TreeviewItem,
    product: Product,
    productGameTypes: GameType[],
    numberGameBetTypes: GameType[],
    numberGameHappyFiveBetTypes: GameType[],
    numberGameHappyFiveLinkedGamesBetTypes: GameType[],
    sabaClubBetTypes: GameType[],
    sabaClubFreeBetBetTypes: GameType[],
    vGamingBetTypes: GameType[],
    vGamingFreeBetBetTypes: GameType[]) {
    treeItem.children = productGameTypes.map(gameType => {
      const item = new TreeviewItem({
        text: gameType.typeName,
        value: gameType
      });

      if (product.productId === ProductId.NumberGame) {
        if (gameType.typeId === this.happyFiveLinkedGamesLeagueId) {
          item.children = this.MappingNumberGameBettype(numberGameHappyFiveLinkedGamesBetTypes, gameType);
        } else if (gameType.typeId === this.happyFiveLeagueId) {
          item.children = this.MappingNumberGameBettype(numberGameHappyFiveBetTypes, gameType);
        } else {
          item.children = this.MappingNumberGameBettype(numberGameBetTypes, gameType);
        }
      }

      if (product.productId === ProductId.SabaClub && gameType.typeId === GameTypeId.SabaClub) {
        item.children = this.MappingSportGameType(sabaClubBetTypes, gameType);
      }

      if (product.productId === ProductId.SabaClub && gameType.typeId === GameTypeId.SabaClubFreeBet) {
        item.children = this.MappingSportGameType(sabaClubFreeBetBetTypes, gameType);
      }

      if (product.productId === ProductId.VGaming && gameType.typeId === GameTypeId.VGaming) {
        item.children = this.MappingSportGameType(vGamingBetTypes, gameType);
      }

      if (product.productId === ProductId.VGaming && gameType.typeId === GameTypeId.VGamingFreeBet) {
        item.children = this.MappingSportGameType(vGamingFreeBetBetTypes, gameType);
      }

      return item;
    });
  }

  private MappingNumberGameBettype(numberGameBetTypes: GameType[], gameType: GameType): TreeviewItem[] {
    const treeItems = numberGameBetTypes.map(betType => {
      const numberGameLeagueGameType: NumberGameGameType = _.extend({}, { leagueId: gameType.typeId }, betType);
      return new TreeviewItem({
        text: betType.typeName,
        value: numberGameLeagueGameType
      });
    });

    return treeItems;
  }

  private MappingSportGameType(betTypes: GameType[], gameType: GameType): TreeviewItem[] {
    const treeItems = betTypes.map(betType => {
      const sportGameType: SportGameType = _.extend({}, { sportType: gameType.typeId }, betType);
      return new TreeviewItem({
        text: betType.typeName,
        value: sportGameType
      });
    });

    return treeItems;
  }

  private GetNumberGameBetTypes(gameTypes: GameType[]): NumberGameBetTypes {
    const numberGameGameTypes = gameTypes.filter(x => x.productId === ProductId.NumberGame);
    const numberGameBetTypes: GameType[] = [];
    const numberGameHappyFiveBetTypes: GameType[] = [];
    const numberGameHappyFiveLinkedGamesBetTypes: GameType[] = [];
    const otherBetTypes: GameType[] = [];

    numberGameGameTypes.forEach(gameType => {
      if (gameType.gameType === GameTypeId.BetType) {
        if (gameType.typeId >= this.happyFiveMinBetType
          && gameType.typeId <= this.happyFiveMaxBetType) {
          numberGameHappyFiveBetTypes.push(gameType);
        } else if (gameType.typeId >= this.happyFiveLinkedGamesMinBetType
          && gameType.typeId <= this.happyFiveLinkedGamesMaxBetType) {
          numberGameHappyFiveLinkedGamesBetTypes.push(gameType);
        } else {
          numberGameBetTypes.push(gameType);
        }
      } else {
        otherBetTypes.push(gameType);
      }
    });

    return {
      numberGameBetTypes: numberGameBetTypes,
      numberGameHappyFiveBetTypes: numberGameHappyFiveBetTypes,
      numberGameHappyFiveLinkedGamesBetTypes: numberGameHappyFiveLinkedGamesBetTypes,
      otherBetTypes: otherBetTypes
    } as NumberGameBetTypes;
  }

  private GetProductHaveFreeBetBetTypes(
    gameTypes: GameType[],
    productId: number,
    bettypeId: number,
    freeBetBettypeId: number): ProductHaveFreeBetbBetTypes {
    const betTypes: GameType[] = [];
    const freeBetBetTypes: GameType[] = [];
    const otherBetTypes: GameType[] = [];
    const productGameTypes = gameTypes.filter(x => x.productId === productId);

    productGameTypes.forEach(gameType => {
      if (gameType.gameType === bettypeId) {
        betTypes.push(gameType);
      } else if (gameType.gameType === freeBetBettypeId) {
        freeBetBetTypes.push(gameType);
      } else {
        otherBetTypes.push(gameType);
      }
    });

    return {
      betTypes: betTypes,
      freeBetBetTypes: freeBetBetTypes,
      otherBetTypes: otherBetTypes
    } as ProductHaveFreeBetbBetTypes;
  }
}

export interface ProductHaveFreeBetbBetTypes {
  betTypes: GameType[];
  freeBetBetTypes: GameType[];
  otherBetTypes: GameType[];
}

export interface NumberGameBetTypes {
  numberGameBetTypes: GameType[];
  numberGameHappyFiveBetTypes: GameType[];
  numberGameHappyFiveLinkedGamesBetTypes: GameType[];
  otherBetTypes: GameType[];
}

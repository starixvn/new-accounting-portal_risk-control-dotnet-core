import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TreeviewItem } from 'ngx-treeview';
import { Device, GameType, NumberGameBetTypes, NumberGameGameType, Product, ProductHaveFreeBetBetTypes, SiteGroupModel, SportGameType, Currency } from './filter.model';
import { CasinoType, GameTypeId, ProductId } from '../common';
@Injectable()
export class TreeViewBuilderService {
  private readonly happyFiveLeagueId = 79747;
  private readonly happyFiveLinkedGamesLeagueId = 168;
  private readonly happyFiveMinBetType = 8101;
  private readonly happyFiveMaxBetType = 8120;
  private readonly happyFiveLinkedGamesMinBetType = 3601;
  private readonly happyFiveLinkedGamesMaxBetType = 3610;

  buildProductTreeViewItems(products: Product[], selectedProducts: Product[]): TreeviewItem[] {
    let productCategory = '';
    let result: TreeviewItem[] = [];
    let categoryIndex = -1;

    if (_.isNil(products)) {
      return [];
    }

    products.forEach(product => {
      let checked = false;
      if (selectedProducts.length > 0) {
        const aa = selectedProducts.filter(x => x.productId === product.productId);
        if (aa != null && aa.length > 0) {
          checked = true;
        }
      }
      if (product.productCategory !== productCategory) {
        if (result.length > 0) {
          result[categoryIndex].correctChecked();
        }
        result.push(new TreeviewItem({ 
          text: product.productCategory,
          value: undefined,
          children: [{ text: product.productName, value: product, checked: checked }]
        }));
        categoryIndex++;
        productCategory = product.productCategory;
      } else {
       result[categoryIndex].children.push(new TreeviewItem({ text: product.productName, value: product, checked: checked })); 
      }
    });
    return result;
  }

  buildSiteTreeViewItems(sites: SiteGroupModel[], selectedSites: SiteGroupModel[]): TreeviewItem[] {
    if (_.isNil(sites)) {
      return [];
    }

    return this.createTree(sites, selectedSites);
  }

  buildGameTypeTreeViewItems(gameTypes: GameType[], products: Product[], selectedGameTypes: GameType[]): TreeviewItem[] {
    if (_.isNil(gameTypes)) {
      return [];
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
        vGamingFreeBetBetTypes,
        selectedGameTypes);

      items.push(treeItem);
    });

    return items;
  }

  buildDeviceTreeViewItems(devices: Device[], selectedDevices: Device[]): TreeviewItem[] {
    if (_.isNil(devices)) {
      return [];
    }

    const mobileTreeItem = new TreeviewItem({ text: 'Mobile', value: undefined });
    const nonMobileTreeItem = new TreeviewItem({ text: 'Non-mobile', value: undefined });
    const uncategorizedTreeItem = new TreeviewItem({ text: 'Uncategorized', value: undefined });
    devices.forEach(device => {
      let checked = false;
      if (selectedDevices.length > 0) {
        const aa = selectedDevices.filter(x => x.fullName === device.fullName);
        if (aa != null && aa.length > 0) {
          checked = true;
        }
      }
      const item = new TreeviewItem({ text: device.fullName, value: device, checked: checked });
      let groupTreeviewItem: TreeviewItem;
      switch (device.groupName) {
        case 'Mobile':
          groupTreeviewItem = mobileTreeItem;
          break;
        case 'Non-mobile':
          groupTreeviewItem = nonMobileTreeItem;
          break;
        default:
          groupTreeviewItem = uncategorizedTreeItem;
          break;
      }

      if (_.isNil(groupTreeviewItem.children)) {
        groupTreeviewItem.children = [item];
      } else {
        groupTreeviewItem.children.push(item);
      }
    });

    const treeItems = [
      mobileTreeItem,
      nonMobileTreeItem,
      uncategorizedTreeItem
    ];
    return treeItems.filter(item => !_.isNil(item.children) && item.children.length > 0);
  }

  buildCurrencyTreeViewItems(currencies: Currency[], selectedCurrencies: Currency[]): TreeviewItem[] {
    let result: TreeviewItem[] = [];
    currencies.forEach(currency => {
      let checked = false;
      if (selectedCurrencies.length > 0) {
        const aa = selectedCurrencies.filter(x => x.exchangeId === currency.exchangeId);
        if (aa != null && aa.length > 0) {
          checked = true;
        }
      }

      const item = new TreeviewItem({ text: currency.currency, value: currency, checked: checked });
      result.push(item);
    });

    return result;
  }

  private createTree(siteGroups: SiteGroupModel[], selectedSites: SiteGroupModel[]): TreeviewItem[] {
    if (siteGroups === null || siteGroups.length === 0) {
      return [];
    }

    var tree = siteGroups.map(siteGroup => {
      let checked = false;
      if (selectedSites.length > 0) {
        const aa = selectedSites.filter(x => x.licenseeName === siteGroup.licenseeName && x.groupName === siteGroup.groupName);
        if (aa != null && aa.length > 0) {
          checked = true;
        }
      }

      return new TreeviewItem({
        text: siteGroup.groupName !== null ? siteGroup.groupName : siteGroup.licenseeName,
        value: siteGroup,
        checked: checked,
        children: this.createTree(siteGroup.childGroups, selectedSites)
      });
    });

    return tree;
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
    vGamingFreeBetBetTypes: GameType[],
    selectedGameTypes: GameType[]): TreeviewItem {
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
      vGamingFreeBetBetTypes,
      selectedGameTypes);

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
    vGamingBFreeBetBetTypes: GameType[],
    selectedGameTypes: GameType[]) {

    treeItem.children = productGameTypes.map(gameType => {
      let checked = false;
      if (selectedGameTypes.length > 0) {
        const aa = selectedGameTypes.filter(x => x.typeId === gameType.typeId && x.productId === product.productId);
        if (aa != null && aa.length > 0) {
          checked = true;
        }
      }

      const item = new TreeviewItem({
        text: gameType.typeName,
        value: gameType,
        checked: checked
      });

      if (product.productId === ProductId.NumberGame) {
        if (gameType.typeId === this.happyFiveLinkedGamesLeagueId) {
          item.children = this.MappingNumberGameBettype(product.productId, numberGameHappyFiveLinkedGamesBetTypes, gameType, selectedGameTypes);
        } else if (gameType.typeId === this.happyFiveLeagueId) {
          item.children = this.MappingNumberGameBettype(product.productId, numberGameHappyFiveBetTypes, gameType, selectedGameTypes);
        } else {
          item.children = this.MappingNumberGameBettype(product.productId, numberGameBetTypes, gameType, selectedGameTypes);
        }
      }

      if (product.productId === ProductId.SabaClub && gameType.typeId === GameTypeId.SabaClub) {
        item.children = this.MappingSportGameType(product.productId, sabaClubBetTypes, gameType, selectedGameTypes);
      }

      if (product.productId === ProductId.SabaClub && gameType.typeId === GameTypeId.SabaClubFreeBet) {
        item.children = this.MappingSportGameType(product.productId, sabaClubFreeBetBetTypes, gameType, selectedGameTypes);
      }

      if (product.productId === ProductId.VGaming && gameType.typeId === GameTypeId.VGaming) {
        item.children = this.MappingSportGameType(product.productId, vGamingBetTypes, gameType, selectedGameTypes);
      }

      if (product.productId === ProductId.VGaming && gameType.typeId === GameTypeId.VGamingFreeBet) {
        item.children = this.MappingSportGameType(product.productId, vGamingBFreeBetBetTypes, gameType, selectedGameTypes);
      }

      return item;
    });
  }

  private MappingNumberGameBettype(productId: number, numberGameBetTypes: GameType[], gameType: GameType, selectedGameTypes: GameType[]): TreeviewItem[] {
    const treeItems = numberGameBetTypes.map(betType => {
      let checked = false;
      if (selectedGameTypes.length > 0) {
        const aa = selectedGameTypes.filter(x => x.typeId === betType.typeId && x.productId === productId);
        if (aa != null && aa.length > 0) {
          checked = true;
        }
      }
      const numberGameLeagueGameType: NumberGameGameType = _.extend({}, { leagueId: gameType.typeId }, betType);
      return new TreeviewItem({
        text: betType.typeName,
        value: numberGameLeagueGameType,
        checked: checked
      });
    });

    return treeItems;
  }

  private MappingSportGameType(productId: number, betTypes: GameType[], gameType: GameType, selectedGameTypes: GameType[]): TreeviewItem[] {
    const treeItems = betTypes.map(betType => {
      let checked = false;
      if (selectedGameTypes.length > 0) {
        const aa = selectedGameTypes.filter(x => x.typeId === betType.typeId && x.productId === productId);
        if (aa != null && aa.length > 0) {
          checked = true;
        }
      }
      const sportGameType: SportGameType = _.extend({}, { sportType: gameType.typeId }, betType);
      return new TreeviewItem({
        text: betType.typeName,
        value: sportGameType,
        checked: checked
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
    freeBetBettype: number): ProductHaveFreeBetBetTypes {
    const betTypes: GameType[] = [];
    const freeBetBetTypes: GameType[] = [];
    const otherBetTypes: GameType[] = [];
    const productGameTypes = gameTypes.filter(x => x.productId === productId);

    productGameTypes.forEach(gameType => {
      if (gameType.gameType === bettypeId) {
        betTypes.push(gameType);
      } else if (gameType.gameType === freeBetBettype) {
        freeBetBetTypes.push(gameType);
      } else {
        otherBetTypes.push(gameType);
      }
    });

    return {
      betTypes: betTypes,
      freeBetBetTypes: freeBetBetTypes,
      otherBetTypes: otherBetTypes
    } as ProductHaveFreeBetBetTypes;
  }
}


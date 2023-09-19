import * as _ from 'lodash';
import { SelectItem } from 'nap-components/dropdown-select';
import { RoleId, CasinoType, ProductId, GameTypeId } from '../common';
import {
  ReportType,
  GameTypeModel,
  GameTypeResult,
  NumberGameGameType,
  NumberGameLeagueBetType,
  SportGameType,
  SportBetType
} from './filter.model';

const roleSelectItems: SelectItem[] = [
  { text: 'Super', value: RoleId.Super },
  { text: 'Master', value: RoleId.Master },
  { text: 'Agent', value: RoleId.Agent },
  { text: 'Member', value: RoleId.Member }
];

const reportSelectItems: SelectItem[] = [
  { text: 'Hourly', value: ReportType.Hourly },
  { text: 'Daily', value: ReportType.Daily },
  { text: 'Monthly', value: ReportType.Monthly },
  { text: 'Product', value: ReportType.Product },
  { text: 'Company', value: ReportType.Company },
  { text: 'Currency', value: ReportType.Currency },
  { text: 'Device', value: ReportType.Device },
  { text: 'Username', value: ReportType.UserName },
  { text: 'Top 20', value: ReportType.Top20 }
];

export const FilterHelper = {
  getRoleSelectItems: getRoleSelectItems,
  getRoleName: getRoleName,
  getReportSelectItems: getReportSelectItems,
  getReportName: getReportName,
  calculateGameTypes: calculateGameTypes,
};

function getRoleSelectItems(): SelectItem[] {
  return roleSelectItems;
}

function getRoleName(roleId: RoleId): string {
  return roleSelectItems.filter(item => item.value === roleId)[0].text;
}

function getReportSelectItems(): SelectItem[] {
  return reportSelectItems;
}

function getReportName(reportType: ReportType): string {
  let reportName = reportSelectItems.filter(item => item.value === reportType)[0].text;

  return reportName;
}

function calculateGameTypes(model: GameTypeModel): GameTypeResult {
  const productIds = _.uniq(model.gameTypes.map(gameType => gameType.productId));
  const otherProductIds = _.uniq(model.gameTypes
    .filter(x => x.productId !== ProductId.NumberGame
      && x.productId !== ProductId.SabaClub
      && x.productId !== ProductId.VGaming)
    .map(gameType => gameType.productId));
  let betTypes: number[] = [];
  let leagueIds: NumberGameLeagueBetType[] = [];
  let sportTypes: number[] = [];
  let sportBetTypes: SportBetType[] = [];

  leagueIds = getLeagueIds(model);
  sportBetTypes = getSportBetTypes(model);
  otherProductIds.forEach(productId => {
    const productGameTypes = model.gameTypes.filter(gameType => gameType.productId === productId);
    const productTypeIds = productGameTypes.map(gameType => gameType.typeId);
    const filterProducts = model.products.filter(product => product.productId === productId);

    if (filterProducts.length !== 1) {
      return {
        productIds: productIds,
        betTypes: betTypes,
        sportTypes: sportTypes,
        leagueIds: leagueIds,
        sportBetTypes: sportBetTypes
      } as GameTypeResult;
    }

    const casinoType = filterProducts[0].casinoType;

    if (casinoType !== CasinoType.None) {
      betTypes = betTypes.concat(productTypeIds);
    } else {
      const gameTypeId: GameTypeId = productGameTypes[0].gameType;
      if (gameTypeId === GameTypeId.SportType) {
        sportTypes = sportTypes.concat(productTypeIds);
      }

      if (gameTypeId === GameTypeId.BetType) {
        betTypes = betTypes.concat(productTypeIds);
      }
    }
  });

  return {
    productIds: productIds,
    betTypes: betTypes,
    sportTypes: sportTypes,
    leagueIds: leagueIds,
    sportBetTypes: sportBetTypes
  } as GameTypeResult;
}

function getLeagueIds(model: GameTypeModel): NumberGameLeagueBetType[] {
  const productGameTypes = model.gameTypes.filter(gameType => gameType.productId === ProductId.NumberGame);
  return productGameTypes.map((gameType: NumberGameGameType) => {
    return {
      leagueId: gameType.leagueId,
      betType: gameType.typeId
    };
  });

}

function getSportBetTypes(model: GameTypeModel): SportBetType[] {
  const productGameTypes = model.gameTypes.filter(gameType => gameType.productId === ProductId.SabaClub
    || gameType.productId === ProductId.VGaming);
  return productGameTypes.map((gameType: SportGameType) => {
    return {
      sportType: gameType.sportType,
      betType: gameType.typeId
    };
  });
}

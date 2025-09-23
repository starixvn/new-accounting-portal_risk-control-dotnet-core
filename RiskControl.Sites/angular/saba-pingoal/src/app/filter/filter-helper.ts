import * as _ from 'lodash';
import { SelectItem } from 'nap-components/dropdown-select';
import { RoleId } from '../common';

const roleSelectItems: SelectItem[] = [
  { text: 'Super', value: RoleId.Super },
  { text: 'Master', value: RoleId.Master },
  { text: 'Agent', value: RoleId.Agent },
  { text: 'Member', value: RoleId.Member }
];

export const FilterHelper = {
  getRoleSelectItems: getRoleSelectItems,
  getRoleName: getRoleName
};

function getRoleSelectItems(): SelectItem[] {
  return roleSelectItems;
}

function getRoleName(roleId: RoleId): string {
  return roleSelectItems.filter(item => item.value === roleId)[0].text;
}

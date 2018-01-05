import { Customer, AssociatedUser, AccountModel } from './index';

export let fakeAccountModelsWith3AssociatedUsers: AccountModel = createFakeAccountModel(3);
export let fakeAccountModelsWithNoAssociatedUsers: AccountModel = createFakeAccountModel(0);

function createFakeAccountModel(associatedUserCount: number): AccountModel {
  return {
    Customer: createCustomer(),
    UsersByDevice: createAssociatedUsers(associatedUserCount),
    UsersByIP: createAssociatedUsers(associatedUserCount),
  };
}

function createCustomer(): Customer {
  return {
    CustId: 1,
    Username: 'User 1',
    Agent: 'Agent 1',
    AgentId: 2,
    Master: 'Master 1',
    MasterId: 3,
    Super: 'Super 1',
    SuperId: 4,
    SiteName: 'Site 1',
    IsCreditUser: true
  };
}

function createAssociatedUsers(count: number) {
  const users: AssociatedUser[] = [];
  for (let i = 1; i <= count; i++) {
    const user = createAssociatedUser(i);
    users.push(user);
  }
  return users;
}

function createAssociatedUser(seed: number) {
  return {
    Username: seed.toString(),
    SiteName: seed.toString(),
    Evidence: seed.toString(),
    LastAccessedDate: new Date(2017, 0, seed % 28)
  };
}

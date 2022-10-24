export interface Customer {
    custId: number;
    username: string;
    agent: string;
    agentId: number;
    master: string;
    masterId: number;
    super: string;
    superId: number;
    siteName: string;
    isCreditUser: boolean;
}


export interface AssociatedUser {
    custId: number;
    username: string;
    site: string;
    lastBettingDate: Date;
}

export interface AccountModel {
    customer: Customer;
    usersByDevice: AssociatedUser[];
    usersByIP: AssociatedUser[];
    usersByManual: AssociatedUser[];
}

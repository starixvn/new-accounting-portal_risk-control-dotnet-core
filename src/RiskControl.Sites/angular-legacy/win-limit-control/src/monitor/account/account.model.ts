export interface Customer {
    CustId: number;
    Username: string;
    Agent: string;
    AgentId: number;
    Master: string;
    MasterId: number;
    Super: string;
    SuperId: number;
    SiteName: string;
    IsCreditUser: boolean;
}


export interface AssociatedUser {
    CustId: number;
    Username: string;
    Site: string;
    LastBettingDate: Date;
}

export interface AccountModel {
    Customer: Customer;
    UsersByDevice: AssociatedUser[];
    UsersByIP: AssociatedUser[];
    UsersByManual: AssociatedUser[];
}

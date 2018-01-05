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
    Username: string;
    SiteName: string;
    Evidence: string;
    LastAccessedDate: Date;
}

export interface AccountModel {
    Customer: Customer;
    UsersByDevice: AssociatedUser[];
    UsersByIP: AssociatedUser[];
}

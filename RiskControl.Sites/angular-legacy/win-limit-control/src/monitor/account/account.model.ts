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


export interface AssociationAccountModel {
    account: string;
    site: string;
    lastTicketDate: Date;
    associationTypeName: string;
}

export interface AccountModel {
    customer: Customer;
    associations: AssociationAccountModel[];
}

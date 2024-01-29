using System;

namespace RiskControl.AssociatedAcccount;

public class AssociationAccountModel
{
    public string AssociationTypeName { get; set; }
       
    public string Site { get; set; }

    public string Account { get; set; }

    public DateTime LastTicketDate { get; set; }
}
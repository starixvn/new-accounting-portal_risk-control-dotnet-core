using System;

namespace RiskControl.AssociatedAcccount
{
    public class AssociationModel
    {
        public int AssociationTypeID { get; set; }

        public string AssociationTypeName { get; set; }
       
        public int CustId { get; set; }

        public DateTime LastTicketDate { get; set; }
    }
}

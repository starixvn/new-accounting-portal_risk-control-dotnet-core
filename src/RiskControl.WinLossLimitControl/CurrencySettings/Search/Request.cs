using System.Collections.Generic;
using MediatR;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Search
{
    public class Request : IRequest<List<SettingSite>>
    {
        public int ProductId { get; set; }

        public int SiteId { get; set; }

        public bool IsCreditSite { get; set; }

        public int CurrencyId { get; set; }

        public int GroupId { get; set; }
    }
}
using System;
using System.Collections.Generic;
using MediatR;

namespace RiskControl.WinLossLimitControl.Monitor.Search
{
    public class Request : IRequest<List<MonitorModel>>
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int ProductId { get; set; }

        public string Username { get; set; }

        public string MultiSite { get; set; }

        public int CurrencyId { get; set; }

        public string LevelId { get; set; }

        public bool ExcludeTestData { get; set; }
    }
}
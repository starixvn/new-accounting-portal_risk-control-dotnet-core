using System.Collections.Generic;
using MediatR;
using RiskControl.WinLossLimitControl.PlayerSettings.Search.Model;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Search
{
    public class Request : IRequest<List<PlayerSettingCurrency>>
    {
        public string Username { get; set; }

        public string MultiSite { get; set; }

        public byte ProductId { get; set; }

        public int CurrencyId { get; set; }
    }
}
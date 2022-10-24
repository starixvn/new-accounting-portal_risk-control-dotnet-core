using System.Collections.Generic;
using MediatR;
using RiskControl.WinLossLimitControl.PlayerSettings.Search.Model;

namespace RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting
{
    public class RequestSearch : IRequest<List<PlayerSettingCurrency>>
    {
        public string Username { get; set; }
    }
}
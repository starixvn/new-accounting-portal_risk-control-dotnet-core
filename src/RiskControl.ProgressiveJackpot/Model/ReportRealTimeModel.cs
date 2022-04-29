using System;
using Epplus.Mapper.Annotations;
using RiskControl.ProgressiveJackpot.ApiModel;

namespace RiskControl.ProgressiveJackpot.Model
{
    public class ReportRealTimeModel
    {
        public EnglishName GameTypeName { get; set; }

        public EnglishName JackpotTypeName { get; set; }

        public EnglishName GameGroupName { get; set; }

        [Cell("D5")]
        public DateTime JackpotStartDate { get; set; }

        [Cell("E5")]
        public int PlayerCount { get; set; }

        [Cell("F5")]
        public int BetCount { get; set; }

        [Cell("G5")]
        public decimal TotalBet { get; set; }

        [Cell("H5")]
        public decimal CurrentRefundPool { get; set; }

        [Cell("I5")]
        public decimal CurrentReservePool { get; set; }

        [Cell("J5")]
        public decimal CurrentJackpotPool { get; set; }

        public int PJMainId { get; set; }

        public int Level { get; set; }

        [Cell("A5")]
        public string GameGroupNameAlias => GameGroupName == null
                 ? string.Empty
                 : GameGroupName.EN;

        [Cell("B5")]
        public string GameTypeNameAlias => GameTypeName == null
                    ? string.Empty
                    : GameTypeName.EN;

        [Cell("C5")]
        public string JackpotTypeNameAlias => JackpotTypeName == null
                   ? string.Empty
                   : JackpotTypeName.EN;
    }
}

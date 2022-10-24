using System;
using Epplus.Mapper.Annotations;
using RiskControl.ProgressiveJackpot.ApiModel;

namespace RiskControl.ProgressiveJackpot.Model
{
    public class ReportWinRecordModel
    {
        public EnglishName GameTypeName { get; set; }

        public EnglishName JackpotTypeName { get; set; }

        public EnglishName GameGroupName { get; set; }

        [Cell("D5")]
        public DateTime JackpotStartDate { get; set; }

        [Cell("E5")]
        public DateTime JackpotHitDate { get; set; }

        [Cell("F5")]
        public string UserName { get; set; }

        [Cell("G5")]
        public decimal WinningAmt { get; set; }

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

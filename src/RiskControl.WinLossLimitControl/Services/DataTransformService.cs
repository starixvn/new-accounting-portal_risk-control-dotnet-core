using System.Collections.Generic;
using System.Linq;
using RiskControl.WinLossLimitControl.Constants;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.Services
{
    public interface DataTransformService
    {
        void UpdateFromRaw(WinLossLimit winLossLimit, List<WinLossLimitRaw> rawList);
    }

    public class DataTransformServiceImp : DataTransformService
    {
        public void UpdateFromRaw(WinLossLimit winLossLimit, List<WinLossLimitRaw> rawList)
        {
            winLossLimit.BlackLimit = rawList
                        .Where(x => x.LevelId == LimitLevelConstant.BlackLevel)
                        .Select(x => x.MaxWinLimit)
                        .FirstOrDefault();
            winLossLimit.GreyLimit = rawList
                        .Where(x => x.LevelId == LimitLevelConstant.GreyLevel)
                        .Select(x => x.MaxWinLimit)
                        .FirstOrDefault();
            winLossLimit.OrangeLimit = rawList
                        .Where(x => x.LevelId == LimitLevelConstant.OrangeLevel)
                        .Select(x => x.MaxWinLimit)
                        .FirstOrDefault();
            winLossLimit.YellowLimit = rawList
                        .Where(x => x.LevelId == LimitLevelConstant.YellowLevel)
                        .Select(x => x.MaxWinLimit)
                        .FirstOrDefault();
            winLossLimit.RedLimit = rawList
                        .Where(x => x.LevelId == LimitLevelConstant.RedLevel)
                        .Select(x => x.MaxWinLimit)
                        .FirstOrDefault();
        }
    }
}
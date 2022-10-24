using System.Linq;

namespace RiskControl.WinLossLimitControl.Services
{
    public interface IncreamentedSeriesContrainService
    {
        bool IsPositiveIncreamented(params decimal[] values);

        bool IsNegativeIncreamented(params decimal[] values);

        bool IsIncreamented(params decimal[] values);
    }

    public class IncreamentedSeriesContrainServiceImp : IncreamentedSeriesContrainService
    {
        public bool IsPositiveIncreamented(params decimal[] values)
        {
            return !values.Any(v => v < 0) && IsIncreamented(values);
        }

        public bool IsNegativeIncreamented(params decimal[] values)
        {
            return !values.Any(v => v > 0) && IsIncreamented(values);
        }

        public bool IsIncreamented(params decimal[] values)
        {
            var nonZeroValues = values.Where(l => l != 0).ToArray();
            var loop = nonZeroValues.Length - 1;
            for (var i = 0; i < loop; i++)
            {
                var invalid = nonZeroValues[i] >= nonZeroValues[i + 1];
                if (invalid)
                {
                    return false;
                }
            }

            return true;
        }
    }
}
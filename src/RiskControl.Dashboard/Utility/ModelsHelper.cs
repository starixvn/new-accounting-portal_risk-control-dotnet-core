using System;

namespace RiskControl.Dashboard.Utility
{
    public static class ModelsHelper
    {
        private const DayOfWeek WEEK_START = DayOfWeek.Monday;
        private const byte SIX_WEEK_DAYS = 42;

        public static Tuple<DateTime, DateTime> GetLastSixWeekFromLastWeek()
        {
            DateTime startingDate = DateTime.Today;

            while (startingDate.DayOfWeek != WEEK_START)
            {
                startingDate = startingDate.AddDays(-1);
            }

            var fromDate = startingDate.AddDays(-SIX_WEEK_DAYS);
            var toDate = startingDate.AddDays(-1);

            return Tuple.Create(fromDate, toDate);
        }
    }
}

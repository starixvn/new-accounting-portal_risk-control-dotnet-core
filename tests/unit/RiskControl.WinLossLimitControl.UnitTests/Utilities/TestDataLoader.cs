using System.IO;
using System.Runtime.CompilerServices;
using Newtonsoft.Json;

namespace RiskControl.WinLossLimitControl.UnitTests.Utilities
{
    internal static class TestDataLoader
    {
        internal static T Load<T>(string name, [CallerFilePath] string sourceFilePath = "")
        {
            var sourceDirectory = Path.GetDirectoryName(sourceFilePath);
            var sourceFileName = Path.GetFileNameWithoutExtension(sourceFilePath);
            var dataFilePath = $"{sourceDirectory}\\TestCases\\{sourceFileName}.{name}.json";
            var text = File.ReadAllText(dataFilePath);
            return JsonConvert.DeserializeObject<T>(text);
        }
    }
}
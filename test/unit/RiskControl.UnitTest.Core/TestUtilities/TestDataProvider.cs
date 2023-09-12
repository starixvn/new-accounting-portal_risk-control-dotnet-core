using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.IO;
using System.Runtime.CompilerServices;

namespace RiskControl.UnitTest.Core.TestUtilities;

public static class TestDataProvider
{
    public static T Load<T>(string name, [CallerFilePath] string sourceFilePath = "", string dateTimeFormat = "yyyy:MM:dd")
    {
        var dataFilePath = $"{Path.GetDirectoryName(sourceFilePath)}/{Path.GetFileNameWithoutExtension(sourceFilePath)}.{name}.json";
        var text = File.ReadAllText(dataFilePath);
        var dateTimeConverter = new IsoDateTimeConverter { DateTimeFormat = dateTimeFormat };
        return JsonConvert.DeserializeObject<T>(text, dateTimeConverter);
    }

    public static string LoadTestContent(string name, [CallerFilePath] string sourceFilePath = "")
    {
        var dataFilePath = $"{Path.GetDirectoryName(sourceFilePath)}/{Path.GetFileNameWithoutExtension(sourceFilePath)}.{name}.json";
        return File.ReadAllText(dataFilePath);
    }

    public static void SaveTestContent(string name, object value, [CallerFilePath] string sourceFilePath = "")
    {
        var dataFilePath = $"{Path.GetDirectoryName(sourceFilePath)}/{Path.GetFileNameWithoutExtension(sourceFilePath)}.{name}.json";
        var json = JsonConvert.SerializeObject(value, Formatting.Indented);
        File.WriteAllText(dataFilePath, json);
    }

    public static T LoadByDataSourceName<T>(string name, [CallerFilePath] string sourceFilePath = "", string dateTimeFormat = "yyyy:MM:dd")
    {
        var dataFilePath = $"{Path.GetDirectoryName(sourceFilePath)}/{name}.json";
        var text = File.ReadAllText(dataFilePath);
        var dateTimeConverter = new IsoDateTimeConverter { DateTimeFormat = dateTimeFormat };
        return JsonConvert.DeserializeObject<T>(text, dateTimeConverter);
    }

    public static T LoadData<T>(string dataFilePath, string dateTimeFormat = "yyyy:MM:dd")
    {
        var text = File.ReadAllText(dataFilePath);
        var dateTimeConverter = new IsoDateTimeConverter { DateTimeFormat = dateTimeFormat };
        return JsonConvert.DeserializeObject<T>(text, dateTimeConverter);
    }

    public static void Write(string name, object value, [CallerFilePath] string sourceFilePath = "")
    {
        var dataFilePath = $"{Path.GetDirectoryName(sourceFilePath)}/{Path.GetFileNameWithoutExtension(sourceFilePath)}.{name}.json";
        var json = JsonConvert.SerializeObject(value);
        File.WriteAllText(dataFilePath, json);
    }

    public static void WriteFile(string name, object value, string path)
    {
        var dataFilePath = $"{path}.{name}.json";
        var json = JsonConvert.SerializeObject(value);
        File.WriteAllText(dataFilePath, json);
    }
}
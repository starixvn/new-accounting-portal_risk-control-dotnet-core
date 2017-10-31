namespace RiskControl.Account.Models
{
    public class FunctionLite
    {
        public FunctionLite(string key, int policy)
        {
            Key = key;
            Policy = policy;
        }

        public string Key { get; }

        public int Policy { get; }
    }
}

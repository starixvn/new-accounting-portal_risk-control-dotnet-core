namespace RiskControl.Account.Models
{
    public class Function
    {
        public Function(string key, int policy)
        {
            Key = key;
            Policy = policy;
        }

        public string Key { get; }

        public int Policy { get; }
    }
}

namespace DotNet_API.Utilities
{
    public class ValidationResults
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }

        public ValidationResults(bool isValid, string message)
        {
            IsValid = isValid;
            Message = message;
        }
    }
}

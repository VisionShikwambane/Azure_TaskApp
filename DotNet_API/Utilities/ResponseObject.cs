
namespace DotNet_API.Utilities
{
    public class ResponseObject<T>
    {
        public bool isSuccess { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
        public List<string> Errors { get; internal set; }

        public ResponseObject(bool success, string message, T data = default)
        {
            isSuccess = success;
            Message = message;
            Data = data;
        }
    }
}

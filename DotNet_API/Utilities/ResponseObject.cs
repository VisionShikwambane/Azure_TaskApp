namespace DotNet_API.Utilities
{
    public class ResponseObject<T>
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
        public List<string> Errors { get; set; }

        public ResponseObject(bool isSuccess, string message, T data = default)
        {
            IsSuccess = isSuccess;
            Message = message;
            Data = data;
            Errors = new List<string>();
        }

        public static ResponseObject<T> Success(string message, T data)
        {
            return new ResponseObject<T>(true, message, data);
        }

        public static ResponseObject<T> Fail(string message, List<string> errors = null)
        {
            var response = new ResponseObject<T>(false, message);
            response.Errors = errors ?? new List<string>();
            return response;
        }
    }
}

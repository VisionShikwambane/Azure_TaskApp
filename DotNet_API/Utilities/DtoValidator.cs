using System.ComponentModel.DataAnnotations;

namespace DotNet_API.Utilities
{
    public static class DtoValidator
    {
        public static bool Validate<T>(T dto, out List<string> validationErrors)
        {
            var context = new ValidationContext(dto);
            var results = new List<ValidationResult>();

            if (!Validator.TryValidateObject(dto, context, results, true))
            {
                validationErrors = results.Select(r => r.ErrorMessage).ToList();
                return false;
            }

            validationErrors = new List<string>();
            return true;
        }
    }
}

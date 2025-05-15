using DotNet_API.DataModels;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DotNet_API.DtoModels
{
    public class InvoiceTemplateDto
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public string TemplatePath { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Preview { get; set; } = string.Empty;

        public string[]? Tags { get; set; }

     
    }
}

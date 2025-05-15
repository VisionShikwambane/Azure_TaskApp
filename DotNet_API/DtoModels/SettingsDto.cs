using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DotNet_API.DtoModels
{
    public class SettingsDto
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string UserID { get; set; } = string.Empty;

        public string CompanyName { get; set; } = string.Empty;

        public string CompanyEmail { get; set; } = string.Empty;

        public string CompanyAdress { get; set; } = string.Empty;

        public string CompanyPhone { get; set; } = string.Empty;

        public byte[]? CompanyLogo { get; set; }

        public bool? VatEnabled { get; set; }

        public double? VatRate { get; set; }


        public string InvoicePrefix { get; set; } = string.Empty;

        public string InvoiceNextNo { get; set; } = string.Empty;

        public string DefaultCurrency { get; set; } = string.Empty;


        public string DefaultNote { get; set; } = string.Empty;

        public string DefaultTermsAndConditions { get; set; } = string.Empty;


     

    }
}

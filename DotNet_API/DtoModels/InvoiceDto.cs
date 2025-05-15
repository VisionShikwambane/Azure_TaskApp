using DotNet_API.DataModels;
using System.ComponentModel.DataAnnotations;

namespace DotNet_API.DtoModels
{
    public class InvoiceDto
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string InvoiceNo { get; set; } = string.Empty;

        public byte[]? CompanyLogo { get; set; }

        [Required]
        [MaxLength(255)]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string CompanyEmail { get; set; } = string.Empty;

        [Required]
        [Phone]
        [MaxLength(50)]
        public string CompanyPhone { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string CompanyAddress { get; set; } = string.Empty;

        public byte[]? SignatureImage { get; set; }

        public DateTime? SignatureDate { get; set; }

        [Required]
        public DateTime IssueDate { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [MaxLength(2000)]
        public string? Notes { get; set; }

        [MaxLength(2000)]
        public string? TermsAndConditions { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int ClientId { get; set; }

        public int? templateId { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Subtotal { get; set; }

        [Required]
        [Range(0, 100)]
        public decimal TaxRate { get; set; }

        [Required]
        [MaxLength(10)]
        public string Currency { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Tax { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Total { get; set; }

        public bool isArchived { get; set; }

        public ClientDto? Client { get; set; }

        public InvoiceTemplateDto? InvoiceTemplate { get; set; }

        public List<InvoiceItemDto>? Items { get; set; } = new List<InvoiceItemDto>();
    }
}

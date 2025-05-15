using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DotNet_API.DataModels
{
    [Table("invoices")]
    public class Invoice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
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

        public string? Notes { get; set; }

        public string? TermsAndConditions { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public int ClientId { get; set; }

        public int? TemplateId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxRate { get; set; }

        [Required]
        [MaxLength(10)]
        public string Currency { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Tax { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }

        public bool isArchived { get; set; }


        // Navigation properties
        public Client? Client { get; set; }


        public InvoiceTemplate? InvoiceTemplate { get; set; }

        public ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
    }
}

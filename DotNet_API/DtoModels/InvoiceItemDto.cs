using System.ComponentModel.DataAnnotations;

namespace DotNet_API.DtoModels
{
    public class InvoiceItemDto
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public int InvoiceId { get; set; }
    }
}

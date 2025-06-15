using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DotNet_API.Entities
{
    public class Subscription
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PlanCode { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
        public string SubscriptionId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

    }
}

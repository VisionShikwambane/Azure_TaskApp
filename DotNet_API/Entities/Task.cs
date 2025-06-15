using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

namespace DotNet_API.Entities
{

   
    public class Task
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required]
        public int CategoryID { get; set; }

        [Required]
        public string UserID { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Title { get; set; } = string.Empty;

        [StringLength(255)]
        public string? Description { get; set; }

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; } = false;

        [Required]
        public int PriorityID { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

      




    }

 


}

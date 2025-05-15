using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DotNet_API.DataModels
{
    public class Priority
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
    }

    public class PriorityDTO : Priority
    {

       
    }
}

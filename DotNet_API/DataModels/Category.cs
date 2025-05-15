using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DotNet_API.DataModels
{
    public class Category
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
    }

    public class CategoryDTO : Category
    {

       
    }
}

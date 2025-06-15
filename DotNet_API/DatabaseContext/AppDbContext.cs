
using DotNet_API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Task = DotNet_API.Entities.Task;

namespace DotNet_API.DatabaseContext
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {

        public AppDbContext(DbContextOptions<AppDbContext> options)
         : base(options)
        {
        }




        public DbSet<Task> Tasks { get; set; }

        public DbSet<Subscription> Subscriptions { get; set; }





        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Example: Configuring an entity
         
        }
    }
}

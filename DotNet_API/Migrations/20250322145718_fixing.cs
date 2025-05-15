using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DotNet_API.Migrations
{
    /// <inheritdoc />
    public partial class fixing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InvoicenNextNo",
                table: "Settings",
                newName: "InvoiceNextNo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InvoiceNextNo",
                table: "Settings",
                newName: "InvoicenNextNo");
        }
    }
}


using DotNet_API.DTOs;
using DotNet_API.Entities;
using DotNet_API.Repositories;
using DotNet_API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Task = DotNet_API.Entities.Task;


namespace DotNet_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly GenericService<Task, TaskDto> _service;

        public TaskController(GenericService<Task, TaskDto> service)
        {
            _service = service;
        }



        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());



        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return result == null ? NotFound() : Ok(result);
        }


        [HttpPost]
        public async Task<IActionResult> Create(TaskDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.IsSuccess }, created);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TaskDto dto)
        {
            var response = await _service.UpdateAsync(id, dto);
            if (!response.IsSuccess)
            {
                return BadRequest(response.Message);
            }
            return Ok(response);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _service.DeleteAsync(id);
            if (!response.IsSuccess)
            {
                return NotFound(response.Message);
            }
            return Ok(response);
        }

    }
}

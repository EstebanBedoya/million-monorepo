using Application.Dtos;
using Application.Properties.Commands;
using Application.Properties.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly IMediator _mediator;

    public PropertiesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<PropertyListDto>> GetProperties(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? search = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetPropertiesQuery(page, limit, search, minPrice, maxPrice);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PropertyDetailDto>> GetProperty(string id, CancellationToken cancellationToken = default)
    {
        var query = new GetPropertyByIdQuery(id);
        var result = await _mediator.Send(query, cancellationToken);
        
        if (result == null)
            return NotFound(new { error = "Property not found" });
        
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<PropertyDto>> CreateProperty(
        [FromBody] CreatePropertyDto propertyDto,
        CancellationToken cancellationToken = default)
    {
        var command = new CreatePropertyCommand(propertyDto);
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetProperty), new { id = result.IdProperty }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PropertyDto>> UpdateProperty(
        string id,
        [FromBody] UpdatePropertyDto propertyDto,
        CancellationToken cancellationToken = default)
    {
        var command = new UpdatePropertyCommand(id, propertyDto);
        var result = await _mediator.Send(command, cancellationToken);
        
        if (result == null)
            return NotFound(new { error = "Property not found" });
        
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProperty(string id, CancellationToken cancellationToken = default)
    {
        var command = new DeletePropertyCommand(id);
        var result = await _mediator.Send(command, cancellationToken);
        
        if (!result)
            return NotFound(new { error = "Property not found" });
        
        return Ok(new { message = "Property deleted successfully" });
    }
}

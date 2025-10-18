using Application.Dtos;
using Application.Owners.Commands;
using Application.Owners.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OwnersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OwnersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<OwnerListDto>> GetOwners(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetOwnersQuery(page, limit, search);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OwnerDto>> GetOwner(string id, CancellationToken cancellationToken = default)
    {
        var query = new GetOwnerByIdQuery(id);
        var result = await _mediator.Send(query, cancellationToken);
        
        if (result == null)
            return NotFound(new { error = "Owner not found" });
        
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<OwnerDto>> CreateOwner(
        [FromBody] CreateOwnerDto ownerDto,
        CancellationToken cancellationToken = default)
    {
        var command = new CreateOwnerCommand(ownerDto);
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetOwner), new { id = result.IdOwner }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<OwnerDto>> UpdateOwner(
        string id,
        [FromBody] UpdateOwnerDto ownerDto,
        CancellationToken cancellationToken = default)
    {
        var command = new UpdateOwnerCommand(id, ownerDto);
        var result = await _mediator.Send(command, cancellationToken);
        
        if (result == null)
            return NotFound(new { error = "Owner not found" });
        
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteOwner(string id, CancellationToken cancellationToken = default)
    {
        var command = new DeleteOwnerCommand(id);
        var result = await _mediator.Send(command, cancellationToken);
        
        if (!result)
            return NotFound(new { error = "Owner not found" });
        
        return Ok(new { message = "Owner deleted successfully" });
    }
}


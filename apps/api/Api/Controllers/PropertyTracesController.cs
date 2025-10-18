using Application.Dtos;
using Application.PropertyTraces.Commands;
using Application.PropertyTraces.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/properties/{propertyId}/traces")]
public class PropertyTracesController : ControllerBase
{
    private readonly IMediator _mediator;

    public PropertyTracesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<PropertyTraceListDto>> GetPropertyTraces(
        string propertyId,
        [FromQuery] string? sortBy = "dateSale",
        [FromQuery] string? order = "desc",
        CancellationToken cancellationToken = default)
    {
        var query = new GetPropertyTracesQuery(propertyId, sortBy, order);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<PropertyTraceDto>> CreatePropertyTrace(
        string propertyId,
        [FromBody] CreatePropertyTraceDto traceDto,
        CancellationToken cancellationToken = default)
    {
        var command = new CreatePropertyTraceCommand(propertyId, traceDto);
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetPropertyTraces), new { propertyId }, result);
    }

    [HttpPut("{traceId}")]
    public async Task<ActionResult<PropertyTraceDto>> UpdatePropertyTrace(
        string propertyId,
        string traceId,
        [FromBody] UpdatePropertyTraceDto traceDto,
        CancellationToken cancellationToken = default)
    {
        var command = new UpdatePropertyTraceCommand(traceId, traceDto);
        var result = await _mediator.Send(command, cancellationToken);
        
        if (result == null)
            return NotFound(new { error = "Property trace not found" });
        
        return Ok(result);
    }

    [HttpDelete("{traceId}")]
    public async Task<ActionResult> DeletePropertyTrace(
        string propertyId,
        string traceId,
        CancellationToken cancellationToken = default)
    {
        var command = new DeletePropertyTraceCommand(traceId);
        var result = await _mediator.Send(command, cancellationToken);
        
        if (!result)
            return NotFound(new { error = "Property trace not found" });
        
        return Ok(new { message = "Property trace deleted successfully" });
    }
}


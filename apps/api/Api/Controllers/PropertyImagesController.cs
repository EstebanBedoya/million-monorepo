using Application.Dtos;
using Application.PropertyImages.Commands;
using Application.PropertyImages.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/properties/{propertyId}/images")]
public class PropertyImagesController : ControllerBase
{
    private readonly IMediator _mediator;

    public PropertyImagesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<PropertyImageListDto>> GetPropertyImages(
        string propertyId,
        [FromQuery] bool? enabledOnly = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetPropertyImagesQuery(propertyId, enabledOnly);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<PropertyImageDto>> CreatePropertyImage(
        string propertyId,
        [FromBody] CreatePropertyImageDto imageDto,
        CancellationToken cancellationToken = default)
    {
        var command = new CreatePropertyImageCommand(propertyId, imageDto);
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetPropertyImages), new { propertyId }, result);
    }

    [HttpPut("{imageId}")]
    public async Task<ActionResult<PropertyImageDto>> UpdatePropertyImage(
        string propertyId,
        string imageId,
        [FromBody] UpdatePropertyImageDto imageDto,
        CancellationToken cancellationToken = default)
    {
        var command = new UpdatePropertyImageCommand(imageId, imageDto);
        var result = await _mediator.Send(command, cancellationToken);
        
        if (result == null)
            return NotFound(new { error = "Property image not found" });
        
        return Ok(result);
    }

    [HttpDelete("{imageId}")]
    public async Task<ActionResult> DeletePropertyImage(
        string propertyId,
        string imageId,
        CancellationToken cancellationToken = default)
    {
        var command = new DeletePropertyImageCommand(imageId);
        var result = await _mediator.Send(command, cancellationToken);
        
        if (!result)
            return NotFound(new { error = "Property image not found" });
        
        return Ok(new { message = "Property image deleted successfully" });
    }
}


using Application.Dtos;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Properties.Commands;

public class UpdatePropertyCommandHandler : IRequestHandler<UpdatePropertyCommand, PropertyDto?>
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IOwnerRepository _ownerRepository;
    private readonly IMapper _mapper;

    public UpdatePropertyCommandHandler(
        IPropertyRepository propertyRepository,
        IOwnerRepository ownerRepository,
        IMapper mapper)
    {
        _propertyRepository = propertyRepository;
        _ownerRepository = ownerRepository;
        _mapper = mapper;
    }

    public async Task<PropertyDto?> Handle(UpdatePropertyCommand request, CancellationToken cancellationToken)
    {
        var existingProperty = await _propertyRepository.GetByIdAsync(request.IdProperty, cancellationToken);
        if (existingProperty == null)
            return null;

        if (request.PropertyDto.IdOwner != null)
        {
            var ownerExists = await _ownerRepository.ExistsAsync(request.PropertyDto.IdOwner, cancellationToken);
            if (!ownerExists)
            {
                throw new ArgumentException($"Owner with id {request.PropertyDto.IdOwner} does not exist");
            }
        }

        if (request.PropertyDto.Name != null)
            existingProperty.Name = request.PropertyDto.Name;
        
        if (request.PropertyDto.Address != null)
            existingProperty.Address = request.PropertyDto.Address;
        
        if (request.PropertyDto.Price.HasValue)
            existingProperty.Price = request.PropertyDto.Price.Value;
        
        if (request.PropertyDto.CodeInternal != null)
            existingProperty.CodeInternal = request.PropertyDto.CodeInternal;
        
        if (request.PropertyDto.Year.HasValue)
            existingProperty.Year = request.PropertyDto.Year.Value;
        
        if (request.PropertyDto.IdOwner != null)
            existingProperty.IdOwner = request.PropertyDto.IdOwner;

        var updatedProperty = await _propertyRepository.UpdateAsync(request.IdProperty, existingProperty, cancellationToken);
        
        return updatedProperty != null ? _mapper.Map<PropertyDto>(updatedProperty) : null;
    }
}


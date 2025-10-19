using Application.Dtos;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Properties.Commands;

public class CreatePropertyCommandHandler : IRequestHandler<CreatePropertyCommand, PropertyDto>
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IOwnerRepository _ownerRepository;
    private readonly IMapper _mapper;

    public CreatePropertyCommandHandler(
        IPropertyRepository propertyRepository,
        IOwnerRepository ownerRepository,
        IMapper mapper)
    {
        _propertyRepository = propertyRepository;
        _ownerRepository = ownerRepository;
        _mapper = mapper;
    }

    public async Task<PropertyDto> Handle(CreatePropertyCommand request, CancellationToken cancellationToken)
    {
        var ownerExists = await _ownerRepository.ExistsAsync(request.PropertyDto.IdOwner, cancellationToken);
        if (!ownerExists)
        {
            throw new ArgumentException($"Owner with id {request.PropertyDto.IdOwner} does not exist");
        }

        var property = _mapper.Map<Property>(request.PropertyDto);
        property.IdProperty = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
        
        var createdProperty = await _propertyRepository.CreateAsync(property, cancellationToken);
        
        return _mapper.Map<PropertyDto>(createdProperty);
    }
}


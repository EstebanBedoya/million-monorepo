using Application.Dtos;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.PropertyImages.Commands;

public class CreatePropertyImageCommandHandler : IRequestHandler<CreatePropertyImageCommand, PropertyImageDto>
{
    private readonly IPropertyImageRepository _imageRepository;
    private readonly IPropertyRepository _propertyRepository;
    private readonly IMapper _mapper;

    public CreatePropertyImageCommandHandler(
        IPropertyImageRepository imageRepository,
        IPropertyRepository propertyRepository,
        IMapper mapper)
    {
        _imageRepository = imageRepository;
        _propertyRepository = propertyRepository;
        _mapper = mapper;
    }

    public async Task<PropertyImageDto> Handle(CreatePropertyImageCommand request, CancellationToken cancellationToken)
    {
        var propertyExists = await _propertyRepository.ExistsAsync(request.IdProperty, cancellationToken);
        if (!propertyExists)
        {
            throw new ArgumentException($"Property with id {request.IdProperty} does not exist");
        }

        var image = _mapper.Map<PropertyImage>(request.ImageDto);
        image.IdPropertyImage = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
        image.IdProperty = request.IdProperty;
        
        var createdImage = await _imageRepository.CreateAsync(image, cancellationToken);
        
        return _mapper.Map<PropertyImageDto>(createdImage);
    }
}


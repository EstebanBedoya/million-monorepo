using Application.Dtos;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.PropertyImages.Commands;

public class UpdatePropertyImageCommandHandler : IRequestHandler<UpdatePropertyImageCommand, PropertyImageDto?>
{
    private readonly IPropertyImageRepository _imageRepository;
    private readonly IMapper _mapper;

    public UpdatePropertyImageCommandHandler(IPropertyImageRepository imageRepository, IMapper mapper)
    {
        _imageRepository = imageRepository;
        _mapper = mapper;
    }

    public async Task<PropertyImageDto?> Handle(UpdatePropertyImageCommand request, CancellationToken cancellationToken)
    {
        var existingImage = await _imageRepository.GetByIdAsync(request.IdPropertyImage, cancellationToken);
        if (existingImage == null)
            return null;

        if (request.ImageDto.File != null)
            existingImage.File = request.ImageDto.File;
        
        if (request.ImageDto.Enabled.HasValue)
            existingImage.Enabled = request.ImageDto.Enabled.Value;

        var updatedImage = await _imageRepository.UpdateAsync(request.IdPropertyImage, existingImage, cancellationToken);
        
        return updatedImage != null ? _mapper.Map<PropertyImageDto>(updatedImage) : null;
    }
}


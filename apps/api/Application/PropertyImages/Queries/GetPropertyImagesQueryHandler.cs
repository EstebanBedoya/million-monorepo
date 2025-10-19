using Application.Dtos;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.PropertyImages.Queries;

public class GetPropertyImagesQueryHandler : IRequestHandler<GetPropertyImagesQuery, PropertyImageListDto>
{
    private readonly IPropertyImageRepository _imageRepository;
    private readonly IMapper _mapper;

    public GetPropertyImagesQueryHandler(IPropertyImageRepository imageRepository, IMapper mapper)
    {
        _imageRepository = imageRepository;
        _mapper = mapper;
    }

    public async Task<PropertyImageListDto> Handle(GetPropertyImagesQuery request, CancellationToken cancellationToken)
    {
        var images = await _imageRepository.GetByPropertyIdAsync(
            request.IdProperty,
            request.EnabledOnly,
            cancellationToken);

        var imageDtos = _mapper.Map<List<PropertyImageDto>>(images);

        return new PropertyImageListDto
        {
            Images = imageDtos,
            Total = imageDtos.Count
        };
    }
}


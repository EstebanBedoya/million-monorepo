using Application.Dtos;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Properties.Queries;

public class GetPropertiesQueryHandler : IRequestHandler<GetPropertiesQuery, PropertyListDto>
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IPropertyImageRepository _propertyImageRepository;
    private readonly IMapper _mapper;

    public GetPropertiesQueryHandler(IPropertyRepository propertyRepository, IPropertyImageRepository propertyImageRepository, IMapper mapper)
    {
        _propertyRepository = propertyRepository;
        _propertyImageRepository = propertyImageRepository;
        _mapper = mapper;
    }

    public async Task<PropertyListDto> Handle(GetPropertiesQuery request, CancellationToken cancellationToken)
    {
        var (properties, total) = await _propertyRepository.GetAllAsync(
            request.Page,
            request.Limit,
            request.Search,
            request.MinPrice,
            request.MaxPrice,
            cancellationToken);

        var propertyDtos = _mapper.Map<List<PropertyDto>>(properties);
        
        // Get enabled images for all properties in parallel
        var imageTasks = propertyDtos.Select(async propertyDto =>
        {
            var enabledImages = await _propertyImageRepository.GetByPropertyIdAsync(
                propertyDto.IdProperty, 
                enabledOnly: true, 
                cancellationToken);
            
            propertyDto.Image = enabledImages.FirstOrDefault()?.File;
        });
        
        await Task.WhenAll(imageTasks);
        
        var totalPages = (int)Math.Ceiling(total / (double)request.Limit);

        return new PropertyListDto
        {
            Properties = propertyDtos,
            Pagination = new PaginationDto
            {
                Page = request.Page,
                Limit = request.Limit,
                Total = total,
                TotalPages = totalPages,
                HasNext = request.Page < totalPages,
                HasPrev = request.Page > 1
            }
        };
    }
}


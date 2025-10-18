using Application.Dtos;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Properties.Queries;

public class GetPropertyByIdQueryHandler : IRequestHandler<GetPropertyByIdQuery, PropertyDetailDto?>
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IOwnerRepository _ownerRepository;
    private readonly IPropertyImageRepository _imageRepository;
    private readonly IPropertyTraceRepository _traceRepository;
    private readonly IMapper _mapper;

    public GetPropertyByIdQueryHandler(
        IPropertyRepository propertyRepository,
        IOwnerRepository ownerRepository,
        IPropertyImageRepository imageRepository,
        IPropertyTraceRepository traceRepository,
        IMapper mapper)
    {
        _propertyRepository = propertyRepository;
        _ownerRepository = ownerRepository;
        _imageRepository = imageRepository;
        _traceRepository = traceRepository;
        _mapper = mapper;
    }

    public async Task<PropertyDetailDto?> Handle(GetPropertyByIdQuery request, CancellationToken cancellationToken)
    {
        var property = await _propertyRepository.GetByIdAsync(request.IdProperty, cancellationToken);
        if (property == null)
            return null;

        var propertyDetail = _mapper.Map<PropertyDetailDto>(property);

        var owner = await _ownerRepository.GetByIdAsync(property.IdOwner, cancellationToken);
        if (owner != null)
        {
            propertyDetail.Owner = _mapper.Map<OwnerDto>(owner);
        }

        var images = await _imageRepository.GetByPropertyIdAsync(request.IdProperty, enabledOnly: null, cancellationToken);
        propertyDetail.Images = _mapper.Map<List<PropertyImageDto>>(images);

        var traces = await _traceRepository.GetByPropertyIdAsync(request.IdProperty, cancellationToken: cancellationToken);
        propertyDetail.Traces = _mapper.Map<List<PropertyTraceDto>>(traces);

        return propertyDetail;
    }
}


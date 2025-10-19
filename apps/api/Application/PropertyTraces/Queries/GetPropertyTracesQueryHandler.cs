using Application.Dtos;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.PropertyTraces.Queries;

public class GetPropertyTracesQueryHandler : IRequestHandler<GetPropertyTracesQuery, PropertyTraceListDto>
{
    private readonly IPropertyTraceRepository _traceRepository;
    private readonly IMapper _mapper;

    public GetPropertyTracesQueryHandler(IPropertyTraceRepository traceRepository, IMapper mapper)
    {
        _traceRepository = traceRepository;
        _mapper = mapper;
    }

    public async Task<PropertyTraceListDto> Handle(GetPropertyTracesQuery request, CancellationToken cancellationToken)
    {
        var traces = await _traceRepository.GetByPropertyIdAsync(
            request.IdProperty,
            request.SortBy,
            request.Order,
            cancellationToken);

        var traceDtos = _mapper.Map<List<PropertyTraceDto>>(traces);

        return new PropertyTraceListDto
        {
            Traces = traceDtos,
            Total = traceDtos.Count
        };
    }
}


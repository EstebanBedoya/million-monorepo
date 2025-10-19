using Application.Dtos;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.PropertyTraces.Commands;

public class CreatePropertyTraceCommandHandler : IRequestHandler<CreatePropertyTraceCommand, PropertyTraceDto>
{
    private readonly IPropertyTraceRepository _traceRepository;
    private readonly IPropertyRepository _propertyRepository;
    private readonly IMapper _mapper;

    public CreatePropertyTraceCommandHandler(
        IPropertyTraceRepository traceRepository,
        IPropertyRepository propertyRepository,
        IMapper mapper)
    {
        _traceRepository = traceRepository;
        _propertyRepository = propertyRepository;
        _mapper = mapper;
    }

    public async Task<PropertyTraceDto> Handle(CreatePropertyTraceCommand request, CancellationToken cancellationToken)
    {
        var propertyExists = await _propertyRepository.ExistsAsync(request.IdProperty, cancellationToken);
        if (!propertyExists)
        {
            throw new ArgumentException($"Property with id {request.IdProperty} does not exist");
        }

        var trace = _mapper.Map<PropertyTrace>(request.TraceDto);
        trace.IdPropertyTrace = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
        trace.IdProperty = request.IdProperty;
        
        var createdTrace = await _traceRepository.CreateAsync(trace, cancellationToken);
        
        return _mapper.Map<PropertyTraceDto>(createdTrace);
    }
}


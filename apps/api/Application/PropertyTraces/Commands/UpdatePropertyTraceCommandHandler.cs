using Application.Dtos;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.PropertyTraces.Commands;

public class UpdatePropertyTraceCommandHandler : IRequestHandler<UpdatePropertyTraceCommand, PropertyTraceDto?>
{
    private readonly IPropertyTraceRepository _traceRepository;
    private readonly IMapper _mapper;

    public UpdatePropertyTraceCommandHandler(IPropertyTraceRepository traceRepository, IMapper mapper)
    {
        _traceRepository = traceRepository;
        _mapper = mapper;
    }

    public async Task<PropertyTraceDto?> Handle(UpdatePropertyTraceCommand request, CancellationToken cancellationToken)
    {
        var existingTrace = await _traceRepository.GetByIdAsync(request.IdPropertyTrace, cancellationToken);
        if (existingTrace == null)
            return null;

        if (request.TraceDto.DateSale != null)
            existingTrace.DateSale = DateTime.Parse(request.TraceDto.DateSale);
        
        if (request.TraceDto.Name != null)
            existingTrace.Name = request.TraceDto.Name;
        
        if (request.TraceDto.Value.HasValue)
            existingTrace.Value = request.TraceDto.Value.Value;
        
        if (request.TraceDto.Tax.HasValue)
            existingTrace.Tax = request.TraceDto.Tax.Value;

        var updatedTrace = await _traceRepository.UpdateAsync(request.IdPropertyTrace, existingTrace, cancellationToken);
        
        return updatedTrace != null ? _mapper.Map<PropertyTraceDto>(updatedTrace) : null;
    }
}


using Application.Dtos;
using MediatR;

namespace Application.PropertyTraces.Commands;

public record UpdatePropertyTraceCommand(string IdPropertyTrace, UpdatePropertyTraceDto TraceDto) : IRequest<PropertyTraceDto?>;


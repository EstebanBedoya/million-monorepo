using Application.Dtos;
using MediatR;

namespace Application.PropertyTraces.Commands;

public record CreatePropertyTraceCommand(string IdProperty, CreatePropertyTraceDto TraceDto) : IRequest<PropertyTraceDto>;


using MediatR;

namespace Application.PropertyTraces.Commands;

public record DeletePropertyTraceCommand(string IdPropertyTrace) : IRequest<bool>;


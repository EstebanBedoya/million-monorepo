using Domain.Repositories;
using MediatR;

namespace Application.PropertyTraces.Commands;

public class DeletePropertyTraceCommandHandler : IRequestHandler<DeletePropertyTraceCommand, bool>
{
    private readonly IPropertyTraceRepository _traceRepository;

    public DeletePropertyTraceCommandHandler(IPropertyTraceRepository traceRepository)
    {
        _traceRepository = traceRepository;
    }

    public async Task<bool> Handle(DeletePropertyTraceCommand request, CancellationToken cancellationToken)
    {
        return await _traceRepository.DeleteAsync(request.IdPropertyTrace, cancellationToken);
    }
}


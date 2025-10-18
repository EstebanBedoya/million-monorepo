using Domain.Repositories;
using MediatR;

namespace Application.Owners.Commands;

public class DeleteOwnerCommandHandler : IRequestHandler<DeleteOwnerCommand, bool>
{
    private readonly IOwnerRepository _ownerRepository;

    public DeleteOwnerCommandHandler(IOwnerRepository ownerRepository)
    {
        _ownerRepository = ownerRepository;
    }

    public async Task<bool> Handle(DeleteOwnerCommand request, CancellationToken cancellationToken)
    {
        return await _ownerRepository.DeleteAsync(request.IdOwner, cancellationToken);
    }
}


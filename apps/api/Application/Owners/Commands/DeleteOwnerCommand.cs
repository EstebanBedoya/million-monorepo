using MediatR;

namespace Application.Owners.Commands;

public record DeleteOwnerCommand(string IdOwner) : IRequest<bool>;


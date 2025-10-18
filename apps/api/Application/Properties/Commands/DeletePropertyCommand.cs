using MediatR;

namespace Application.Properties.Commands;

public record DeletePropertyCommand(string IdProperty) : IRequest<bool>;


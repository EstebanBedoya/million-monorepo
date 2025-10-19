using MediatR;

namespace Application.PropertyImages.Commands;

public record DeletePropertyImageCommand(string IdPropertyImage) : IRequest<bool>;


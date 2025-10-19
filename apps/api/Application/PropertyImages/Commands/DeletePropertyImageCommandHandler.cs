using Domain.Repositories;
using MediatR;

namespace Application.PropertyImages.Commands;

public class DeletePropertyImageCommandHandler : IRequestHandler<DeletePropertyImageCommand, bool>
{
    private readonly IPropertyImageRepository _imageRepository;

    public DeletePropertyImageCommandHandler(IPropertyImageRepository imageRepository)
    {
        _imageRepository = imageRepository;
    }

    public async Task<bool> Handle(DeletePropertyImageCommand request, CancellationToken cancellationToken)
    {
        return await _imageRepository.DeleteAsync(request.IdPropertyImage, cancellationToken);
    }
}


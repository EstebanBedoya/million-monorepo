using Application.Dtos;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Owners.Queries;

public class GetOwnerByIdQueryHandler : IRequestHandler<GetOwnerByIdQuery, OwnerDto?>
{
    private readonly IOwnerRepository _ownerRepository;
    private readonly IMapper _mapper;

    public GetOwnerByIdQueryHandler(IOwnerRepository ownerRepository, IMapper mapper)
    {
        _ownerRepository = ownerRepository;
        _mapper = mapper;
    }

    public async Task<OwnerDto?> Handle(GetOwnerByIdQuery request, CancellationToken cancellationToken)
    {
        var owner = await _ownerRepository.GetByIdAsync(request.IdOwner, cancellationToken);
        return owner != null ? _mapper.Map<OwnerDto>(owner) : null;
    }
}


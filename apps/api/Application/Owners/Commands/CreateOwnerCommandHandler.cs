using Application.Dtos;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Owners.Commands;

public class CreateOwnerCommandHandler : IRequestHandler<CreateOwnerCommand, OwnerDto>
{
    private readonly IOwnerRepository _ownerRepository;
    private readonly IMapper _mapper;

    public CreateOwnerCommandHandler(IOwnerRepository ownerRepository, IMapper mapper)
    {
        _ownerRepository = ownerRepository;
        _mapper = mapper;
    }

    public async Task<OwnerDto> Handle(CreateOwnerCommand request, CancellationToken cancellationToken)
    {
        var owner = _mapper.Map<Owner>(request.OwnerDto);
        owner.IdOwner = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
        
        var createdOwner = await _ownerRepository.CreateAsync(owner, cancellationToken);
        
        return _mapper.Map<OwnerDto>(createdOwner);
    }
}


using Application.Dtos;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Owners.Commands;

public class UpdateOwnerCommandHandler : IRequestHandler<UpdateOwnerCommand, OwnerDto?>
{
    private readonly IOwnerRepository _ownerRepository;
    private readonly IMapper _mapper;

    public UpdateOwnerCommandHandler(IOwnerRepository ownerRepository, IMapper mapper)
    {
        _ownerRepository = ownerRepository;
        _mapper = mapper;
    }

    public async Task<OwnerDto?> Handle(UpdateOwnerCommand request, CancellationToken cancellationToken)
    {
        var existingOwner = await _ownerRepository.GetByIdAsync(request.IdOwner, cancellationToken);
        if (existingOwner == null)
            return null;

        if (request.OwnerDto.Name != null)
            existingOwner.Name = request.OwnerDto.Name;
        
        if (request.OwnerDto.Address != null)
            existingOwner.Address = request.OwnerDto.Address;
        
        if (request.OwnerDto.Photo != null)
            existingOwner.Photo = request.OwnerDto.Photo;
        
        if (request.OwnerDto.Birthday != null)
            existingOwner.Birthday = DateTime.Parse(request.OwnerDto.Birthday);

        var updatedOwner = await _ownerRepository.UpdateAsync(request.IdOwner, existingOwner, cancellationToken);
        
        return updatedOwner != null ? _mapper.Map<OwnerDto>(updatedOwner) : null;
    }
}


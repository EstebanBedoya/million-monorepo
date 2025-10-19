using Application.Dtos;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Owners.Queries;

public class GetOwnersQueryHandler : IRequestHandler<GetOwnersQuery, OwnerListDto>
{
    private readonly IOwnerRepository _ownerRepository;
    private readonly IMapper _mapper;

    public GetOwnersQueryHandler(IOwnerRepository ownerRepository, IMapper mapper)
    {
        _ownerRepository = ownerRepository;
        _mapper = mapper;
    }

    public async Task<OwnerListDto> Handle(GetOwnersQuery request, CancellationToken cancellationToken)
    {
        var (owners, total) = await _ownerRepository.GetAllAsync(
            request.Page,
            request.Limit,
            request.Search,
            cancellationToken);

        var ownerDtos = _mapper.Map<List<OwnerDto>>(owners);
        var totalPages = (int)Math.Ceiling(total / (double)request.Limit);

        return new OwnerListDto
        {
            Owners = ownerDtos,
            Pagination = new PaginationDto
            {
                Page = request.Page,
                Limit = request.Limit,
                Total = total,
                TotalPages = totalPages,
                HasNext = request.Page < totalPages,
                HasPrev = request.Page > 1
            }
        };
    }
}


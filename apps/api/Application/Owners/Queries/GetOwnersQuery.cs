using Application.Dtos;
using MediatR;

namespace Application.Owners.Queries;

public record GetOwnersQuery(
    int Page = 1,
    int Limit = 10,
    string? Search = null
) : IRequest<OwnerListDto>;


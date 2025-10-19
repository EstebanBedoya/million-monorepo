using Application.Dtos;
using Application.Properties.Queries;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using FluentAssertions;
using Moq;
using NUnit.Framework;

namespace Tests.Unit.Application.Handlers;

[TestFixture]
public class GetPropertiesQueryHandlerTests
{
    private Mock<IPropertyRepository> _propertyRepositoryMock;
    private Mock<IMapper> _mapperMock;
    private GetPropertiesQueryHandler _handler;

    [SetUp]
    public void Setup()
    {
        _propertyRepositoryMock = new Mock<IPropertyRepository>();
        _mapperMock = new Mock<IMapper>();
        _handler = new GetPropertiesQueryHandler(_propertyRepositoryMock.Object, _mapperMock.Object);
    }

    [Test]
    public async Task Handle_WithValidQuery_ShouldReturnPropertiesWithPagination()
    {
        var properties = new List<Property>
        {
            new Property
            {
                IdProperty = "prop-001",
                Name = "Property 1",
                Address = "Address 1",
                Price = 100000,
                CodeInternal = "CODE-001",
                Year = 2024,
                IdOwner = "owner-001"
            },
            new Property
            {
                IdProperty = "prop-002",
                Name = "Property 2",
                Address = "Address 2",
                Price = 200000,
                CodeInternal = "CODE-002",
                Year = 2024,
                IdOwner = "owner-002"
            }
        };

        var propertyDtos = new List<PropertyDto>
        {
            new PropertyDto
            {
                IdProperty = "prop-001",
                Name = "Property 1",
                Address = "Address 1",
                Price = 100000,
                CodeInternal = "CODE-001",
                Year = 2024,
                IdOwner = "owner-001"
            },
            new PropertyDto
            {
                IdProperty = "prop-002",
                Name = "Property 2",
                Address = "Address 2",
                Price = 200000,
                CodeInternal = "CODE-002",
                Year = 2024,
                IdOwner = "owner-002"
            }
        };

        var query = new GetPropertiesQuery(Page: 1, Limit: 10);

        _propertyRepositoryMock.Setup(x => x.GetAllAsync(1, 10, null, null, null, It.IsAny<CancellationToken>()))
            .ReturnsAsync((properties, 2));

        _mapperMock.Setup(x => x.Map<List<PropertyDto>>(properties))
            .Returns(propertyDtos);

        var result = await _handler.Handle(query, CancellationToken.None);

        result.Should().NotBeNull();
        result.Properties.Should().HaveCount(2);
        result.Pagination.Page.Should().Be(1);
        result.Pagination.Limit.Should().Be(10);
        result.Pagination.Total.Should().Be(2);
        result.Pagination.TotalPages.Should().Be(1);
        result.Pagination.HasNext.Should().BeFalse();
        result.Pagination.HasPrev.Should().BeFalse();

        _propertyRepositoryMock.Verify(x => x.GetAllAsync(1, 10, null, null, null, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task Handle_WithSearchFilter_ShouldPassSearchToRepository()
    {
        var query = new GetPropertiesQuery(Page: 1, Limit: 10, Search: "test");

        _propertyRepositoryMock.Setup(x => x.GetAllAsync(1, 10, "test", null, null, It.IsAny<CancellationToken>()))
            .ReturnsAsync((new List<Property>(), 0));

        _mapperMock.Setup(x => x.Map<List<PropertyDto>>(It.IsAny<IEnumerable<Property>>()))
            .Returns(new List<PropertyDto>());

        var result = await _handler.Handle(query, CancellationToken.None);

        result.Should().NotBeNull();
        _propertyRepositoryMock.Verify(x => x.GetAllAsync(1, 10, "test", null, null, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task Handle_WithPriceFilters_ShouldPassFiltersToRepository()
    {
        var query = new GetPropertiesQuery(Page: 1, Limit: 10, MinPrice: 100000, MaxPrice: 500000);

        _propertyRepositoryMock.Setup(x => x.GetAllAsync(1, 10, null, 100000, 500000, It.IsAny<CancellationToken>()))
            .ReturnsAsync((new List<Property>(), 0));

        _mapperMock.Setup(x => x.Map<List<PropertyDto>>(It.IsAny<IEnumerable<Property>>()))
            .Returns(new List<PropertyDto>());

        var result = await _handler.Handle(query, CancellationToken.None);

        result.Should().NotBeNull();
        _propertyRepositoryMock.Verify(x => x.GetAllAsync(1, 10, null, 100000, 500000, It.IsAny<CancellationToken>()), Times.Once);
    }
}


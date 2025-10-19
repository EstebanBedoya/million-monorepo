using Application.Dtos;
using Application.Properties.Commands;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using FluentAssertions;
using Moq;
using NUnit.Framework;

namespace Tests.Unit.Application.Handlers;

[TestFixture]
public class CreatePropertyHandlerTests
{
    private Mock<IPropertyRepository> _propertyRepositoryMock;
    private Mock<IOwnerRepository> _ownerRepositoryMock;
    private Mock<IMapper> _mapperMock;
    private CreatePropertyCommandHandler _handler;

    [SetUp]
    public void Setup()
    {
        _propertyRepositoryMock = new Mock<IPropertyRepository>();
        _ownerRepositoryMock = new Mock<IOwnerRepository>();
        _mapperMock = new Mock<IMapper>();
        _handler = new CreatePropertyCommandHandler(
            _propertyRepositoryMock.Object,
            _ownerRepositoryMock.Object,
            _mapperMock.Object);
    }

    [Test]
    public async Task Handle_WithValidData_ShouldCreateProperty()
    {
        var createDto = new CreatePropertyDto
        {
            Name = "Test Property",
            Address = "123 Test St",
            Price = 100000,
            CodeInternal = "TEST-001",
            Year = 2024,
            IdOwner = "owner-001"
        };

        var command = new CreatePropertyCommand(createDto);

        var property = new Property
        {
            IdProperty = "prop-001",
            Name = createDto.Name,
            Address = createDto.Address,
            Price = createDto.Price,
            CodeInternal = createDto.CodeInternal,
            Year = createDto.Year,
            IdOwner = createDto.IdOwner
        };

        var propertyDto = new PropertyDto
        {
            IdProperty = property.IdProperty,
            Name = property.Name,
            Address = property.Address,
            Price = property.Price,
            CodeInternal = property.CodeInternal,
            Year = property.Year,
            IdOwner = property.IdOwner
        };

        _ownerRepositoryMock.Setup(x => x.ExistsAsync(createDto.IdOwner, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        _mapperMock.Setup(x => x.Map<Property>(createDto))
            .Returns(property);

        _propertyRepositoryMock.Setup(x => x.CreateAsync(property, It.IsAny<CancellationToken>()))
            .ReturnsAsync(property);

        _mapperMock.Setup(x => x.Map<PropertyDto>(property))
            .Returns(propertyDto);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.Should().NotBeNull();
        result.IdProperty.Should().Be("prop-001");
        result.Name.Should().Be("Test Property");
        result.Price.Should().Be(100000);

        _ownerRepositoryMock.Verify(x => x.ExistsAsync(createDto.IdOwner, It.IsAny<CancellationToken>()), Times.Once);
        _propertyRepositoryMock.Verify(x => x.CreateAsync(It.IsAny<Property>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task Handle_WithNonExistentOwner_ShouldThrowException()
    {
        var createDto = new CreatePropertyDto
        {
            Name = "Test Property",
            Address = "123 Test St",
            Price = 100000,
            CodeInternal = "TEST-001",
            Year = 2024,
            IdOwner = "non-existent-owner"
        };

        var command = new CreatePropertyCommand(createDto);

        _ownerRepositoryMock.Setup(x => x.ExistsAsync(createDto.IdOwner, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        Func<Task> act = async () => await _handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*does not exist*");

        _propertyRepositoryMock.Verify(x => x.CreateAsync(It.IsAny<Property>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}


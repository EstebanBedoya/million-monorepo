using Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

namespace Tests.Unit.Domain.Entities;

[TestFixture]
public class PropertyTests
{
    [Test]
    public void UpdatePrice_WithValidPrice_ShouldUpdatePrice()
    {
        var property = new Property
        {
            IdProperty = "prop-001",
            Name = "Test Property",
            Address = "123 Test St",
            Price = 100000,
            CodeInternal = "TEST-001",
            Year = 2020,
            IdOwner = "owner-001"
        };

        property.UpdatePrice(150000);

        property.Price.Should().Be(150000);
    }

    [Test]
    public void UpdatePrice_WithZeroPrice_ShouldThrowException()
    {
        var property = new Property
        {
            IdProperty = "prop-001",
            Name = "Test Property",
            Address = "123 Test St",
            Price = 100000,
            CodeInternal = "TEST-001",
            Year = 2020,
            IdOwner = "owner-001"
        };

        Action act = () => property.UpdatePrice(0);

        act.Should().Throw<ArgumentException>()
            .WithMessage("Price must be greater than zero");
    }

    [Test]
    public void UpdatePrice_WithNegativePrice_ShouldThrowException()
    {
        var property = new Property
        {
            IdProperty = "prop-001",
            Name = "Test Property",
            Address = "123 Test St",
            Price = 100000,
            CodeInternal = "TEST-001",
            Year = 2020,
            IdOwner = "owner-001"
        };

        Action act = () => property.UpdatePrice(-1000);

        act.Should().Throw<ArgumentException>()
            .WithMessage("Price must be greater than zero");
    }

    [Test]
    public void UpdateInfo_WithValidData_ShouldUpdateAllFields()
    {
        var property = new Property
        {
            IdProperty = "prop-001",
            Name = "Old Name",
            Address = "Old Address",
            Price = 100000,
            CodeInternal = "OLD-001",
            Year = 2020,
            IdOwner = "owner-001"
        };

        property.UpdateInfo("New Name", "New Address", 200000, "NEW-001", 2024, "owner-002");

        property.Name.Should().Be("New Name");
        property.Address.Should().Be("New Address");
        property.Price.Should().Be(200000);
        property.CodeInternal.Should().Be("NEW-001");
        property.Year.Should().Be(2024);
        property.IdOwner.Should().Be("owner-002");
    }

    [Test]
    public void UpdateInfo_WithEmptyName_ShouldThrowException()
    {
        var property = new Property
        {
            IdProperty = "prop-001",
            Name = "Test Property",
            Address = "123 Test St",
            Price = 100000,
            CodeInternal = "TEST-001",
            Year = 2020,
            IdOwner = "owner-001"
        };

        Action act = () => property.UpdateInfo("", "New Address", 200000, "NEW-001", 2024, "owner-002");

        act.Should().Throw<ArgumentException>()
            .WithMessage("Name cannot be empty");
    }

    [Test]
    public void UpdateInfo_WithInvalidYear_ShouldThrowException()
    {
        var property = new Property
        {
            IdProperty = "prop-001",
            Name = "Test Property",
            Address = "123 Test St",
            Price = 100000,
            CodeInternal = "TEST-001",
            Year = 2020,
            IdOwner = "owner-001"
        };

        Action act = () => property.UpdateInfo("New Name", "New Address", 200000, "NEW-001", 1700, "owner-002");

        act.Should().Throw<ArgumentException>()
            .WithMessage("Year must be valid");
    }
}


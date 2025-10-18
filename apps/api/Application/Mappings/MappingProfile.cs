using Application.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Owner, OwnerDto>()
            .ForMember(dest => dest.Birthday, opt => opt.MapFrom(src => src.Birthday.ToString("yyyy-MM-dd")));
        
        CreateMap<CreateOwnerDto, Owner>()
            .ForMember(dest => dest.IdOwner, opt => opt.Ignore())
            .ForMember(dest => dest.Birthday, opt => opt.MapFrom(src => DateTime.Parse(src.Birthday)))
            .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => src.Photo ?? "https://i.pravatar.cc/150?img=1"));

        CreateMap<Property, PropertyDto>();
        CreateMap<Property, PropertyDetailDto>();
        
        CreateMap<CreatePropertyDto, Property>()
            .ForMember(dest => dest.IdProperty, opt => opt.Ignore());

        CreateMap<PropertyImage, PropertyImageDto>();
        
        CreateMap<CreatePropertyImageDto, PropertyImage>()
            .ForMember(dest => dest.IdPropertyImage, opt => opt.Ignore())
            .ForMember(dest => dest.IdProperty, opt => opt.Ignore())
            .ForMember(dest => dest.Enabled, opt => opt.MapFrom(src => src.Enabled ?? true));

        CreateMap<PropertyTrace, PropertyTraceDto>()
            .ForMember(dest => dest.DateSale, opt => opt.MapFrom(src => src.DateSale.ToString("yyyy-MM-dd")));
        
        CreateMap<CreatePropertyTraceDto, PropertyTrace>()
            .ForMember(dest => dest.IdPropertyTrace, opt => opt.Ignore())
            .ForMember(dest => dest.IdProperty, opt => opt.Ignore())
            .ForMember(dest => dest.DateSale, opt => opt.MapFrom(src => DateTime.Parse(src.DateSale)));
    }
}


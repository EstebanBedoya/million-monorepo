using MongoDB.Bson.Serialization.Conventions;

namespace Infrastructure.Mappings;

public static class MongoMappings
{
    private static bool _initialized = false;
    private static readonly object _lock = new object();

    public static void Configure()
    {
        lock (_lock)
        {
            if (_initialized)
                return;

            var conventionPack = new ConventionPack
            {
                new IgnoreExtraElementsConvention(true)
            };
            ConventionRegistry.Register("IgnoreExtraElements", conventionPack, t => true);

            _initialized = true;
        }
    }
}


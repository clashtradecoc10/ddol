import archive from "@/public/archive.json";
import LoadMoreArchive from "./LoadMoreArchive";

const ArchiveGallery = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {archive.slice(0, 12).map((item) => (
        <a
          title={`View all onlyfans leaks from ${item.month_textual} ${item.year}`}
          key={`${item.year}-${item.month_numeric}`}
          href={`/archive/${item.year}-${item.month_numeric}`}
        >
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="grid grid-cols-4 gap-2">
              {item.image_paths.slice(0, 12).map((photo) => (
                <img
                  key={photo}
                  src={`https://dxy6x8yqcf5mp.cloudfront.net/OnlyfansmegaSFW/${photo}`}
                  className="w-full h-[100px] object-cover object-center"
                />
              ))}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{`${item.month_textual} ${item.year}`}</h3>
              <p className="text-muted-foreground">{item.count} leaks</p>
            </div>
          </div>
        </a>
      ))}
      <LoadMoreArchive />
    </div>
  );
};

export default ArchiveGallery;

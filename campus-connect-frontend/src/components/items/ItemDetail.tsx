import { ItemResponse } from "@/lib/types";

interface ItemDetailProps {
  item: ItemResponse;
}

export function ItemDetail({ item }: ItemDetailProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const info = [
    { label: "Category", value: item.category },
    { label: item.type === 'FOUND' ? "Location Found" : "Location Lost", value: item.locationFound },
    { label: item.type === 'FOUND' ? "Date Found" : "Date Lost", value: item.dateFound ? formatDate(item.dateFound) : null },
    { label: "Reported On", value: formatDate(item.createdAt) },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${
        item.type === "FOUND"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}>
        {item.type}
      </span>
      
      <h1 className="text-4xl font-extrabold mb-4">{item.title}</h1>
      
      {item.imageUrl && (
        <div className="w-full h-96 bg-gray-200 rounded-lg mb-6 border flex items-center justify-center">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}
      
      <p className="text-lg text-gray-700 mb-6">{item.description || "No description provided."}</p>
      
      <div className="border-t pt-4">
        <h4 className="text-lg font-semibold mb-2">Item Details</h4>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {info.filter(i => i.value).map(i => (
            <div key={i.label} className="flex py-1">
              <dt className="w-1/3 font-medium text-gray-500">{i.label}</dt>
              <dd className="w-2/3 text-gray-900">{i.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

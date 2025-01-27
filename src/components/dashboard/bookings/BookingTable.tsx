import { useCurrency } from "@/hooks/use-get-currency";
import { Bookings } from "@/lib/types";
import BookingTableRow from "./BookingTableRow";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Modal } from "./Modal";

function EmptyState({ message }: { message: string }) {
  return <div className="text-center text-[#808080]">{message}</div>;
}

function BookingTable({ data }: { data: Bookings[] }) {
  const currency = useCurrency();

  const sortedData = data.slice().sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  if (sortedData.length === 0) {
    return <EmptyState message="No bookings available" />;
  }

  return (
    <div className="flex flex-col gap-6 overflow-x-auto no-scrollbar">
      {sortedData.map((item, i) => (
        <Dialog key={i}>
          <DialogTrigger asChild>
            <div>
              <BookingTableRow booking={item} currency={currency} />
              {i !== sortedData.length - 1 && (
                <div className="border-b border-gray-200 mt-5" />
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="p-0 max-w-xl w-full bg-transparent border-none">
            <Modal booking={item} currency={currency} />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}

export default BookingTable;

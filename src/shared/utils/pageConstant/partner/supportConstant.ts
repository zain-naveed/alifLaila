import { ticketTypes } from "shared/utils/enum";

const TicketTypes: {
  value: string;
  label: string;
}[] = [
  {
    value: String(ticketTypes.support),
    label: "Support",
  },
  {
    value: String(ticketTypes.mou),
    label: "MOU",
  },
];
export { TicketTypes };

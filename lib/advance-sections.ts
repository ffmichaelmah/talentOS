import type { AdvanceCategory } from "@/types";

export interface FieldDef {
  key: string;
  label: string;
  long?: boolean;
  type?: "text" | "date" | "time" | "check";
  placeholder?: string;
}

export interface Section {
  title: string;
  blurb?: string;
  /** The client (promoter/brand) can edit this section via the share link. */
  clientEditable?: boolean;
  fields: FieldDef[];
}

// Grouped so accommodation, transport, hospitality, and the (DJ-focused)
// technical rider are each their own clearly-labelled section.
export const eventSections: Section[] = [
  {
    title: "Schedule & performance",
    fields: [
      { key: "eventName", label: "Event name" },
      { key: "eventDate", label: "Event date", type: "date" },
      { key: "callTime", label: "Call time" },
      { key: "soundcheckTime", label: "Soundcheck time" },
      { key: "performanceTime", label: "Performance time" },
      { key: "setDuration", label: "Set duration", placeholder: "90 min" },
      { key: "expectedCrowd", label: "Expected crowd size" },
      { key: "dressCode", label: "Dress code" },
      { key: "performanceDirection", label: "Music / performance direction", long: true },
    ],
  },
  {
    title: "Artist / manager contact",
    blurb: "Your side — who the client liaises with.",
    fields: [
      { key: "advancingPic", label: "Name", placeholder: "You / tour manager" },
      { key: "advancingPicPhone", label: "Contact number" },
      { key: "advancingPicEmail", label: "Email" },
    ],
  },
  {
    title: "Client-side PIC",
    blurb: "Their side — the promoter or production contact.",
    clientEditable: true,
    fields: [
      { key: "contactPerson", label: "Name", placeholder: "Promoter / production manager" },
      { key: "contactPhone", label: "Contact number" },
      { key: "contactEmail", label: "Email" },
      { key: "onSiteContact", label: "On-site / day-of contact", long: true, placeholder: "Name + phone of who to find on arrival" },
    ],
  },
  {
    title: "Venue",
    clientEditable: true,
    fields: [
      { key: "venueName", label: "Venue name" },
      { key: "clientCompany", label: "Client company" },
      { key: "venueAddress", label: "Venue address", long: true },
      { key: "parkingLoading", label: "Parking / loading info", long: true },
    ],
  },
  {
    title: "Technical rider",
    blurb: "Booth setup, monitors, and tech the venue must provide.",
    fields: [
      { key: "djEquipment", label: "DJ setup / equipment", long: true, placeholder: "2× CDJ-3000, DJM-900NXS2, USB backup slot" },
      { key: "monitors", label: "Monitors", placeholder: "1× booth monitor + sub" },
      { key: "technicalRider", label: "Additional technical notes", long: true, placeholder: "Power, stage/booth position, house engineer" },
    ],
  },
  {
    title: "Hospitality rider",
    blurb: "Green room, catering, and guest list.",
    fields: [
      { key: "greenRoom", label: "Backstage / green room", long: true },
      { key: "mealArrangement", label: "Meal arrangement" },
      { key: "guestList", label: "Guest-list places", placeholder: "4" },
      { key: "hospitalityRider", label: "Drinks / catering rider", long: true, placeholder: "Still & sparkling water, ice, towels, 1 bottle spirit + mixers" },
    ],
  },
  {
    title: "Accommodation",
    blurb: "Hotel for the artist and travelling party.",
    clientEditable: true,
    fields: [
      { key: "hotelName", label: "Hotel name" },
      { key: "hotelConfirmation", label: "Confirmation number" },
      { key: "hotelPhone", label: "Hotel phone" },
      { key: "roomType", label: "Room type / nights", placeholder: "1 king, 2 nights" },
      { key: "hotelAddress", label: "Hotel address", long: true },
      { key: "checkInDate", label: "Check-in date", type: "date" },
      { key: "checkInTime", label: "Check-in time", type: "time" },
      { key: "checkOutDate", label: "Check-out date", type: "date" },
      { key: "checkOutTime", label: "Check-out time", type: "time" },
      { key: "hotelDetails", label: "Accommodation notes", long: true, placeholder: "Breakfast included, late checkout, dietary needs" },
    ],
  },
  {
    title: "Departure flight",
    blurb: "Outbound — to the show.",
    clientEditable: true,
    fields: [
      { key: "outFlightNumber", label: "Flight number", placeholder: "AA 218" },
      { key: "outDepartAirport", label: "From (airport)", placeholder: "LAX" },
      { key: "outDepartDate", label: "Departure date", type: "date" },
      { key: "outDepartTime", label: "Departure time", type: "time" },
      { key: "outArriveAirport", label: "To (airport)", placeholder: "BKK" },
      { key: "outArriveDate", label: "Arrival date", type: "date" },
      { key: "outArriveTime", label: "Arrival time", type: "time" },
    ],
  },
  {
    title: "Return flight",
    blurb: "Inbound — back home.",
    clientEditable: true,
    fields: [
      { key: "retFlightNumber", label: "Flight number", placeholder: "AA 351" },
      { key: "retDepartAirport", label: "From (airport)", placeholder: "BKK" },
      { key: "retDepartDate", label: "Departure date", type: "date" },
      { key: "retDepartTime", label: "Departure time", type: "time" },
      { key: "retArriveAirport", label: "To (airport)", placeholder: "LAX" },
      { key: "retArriveDate", label: "Arrival date", type: "date" },
      { key: "retArriveTime", label: "Arrival time", type: "time" },
    ],
  },
  {
    title: "Ground transport",
    blurb: "Transfers and the day-of itinerary.",
    clientEditable: true,
    fields: [
      { key: "groundTransport", label: "Ground transport" },
      { key: "driverContact", label: "Driver / transfer contact" },
      { key: "itinerary", label: "Itinerary", long: true },
    ],
  },
  {
    title: "Notes",
    fields: [{ key: "specialNotes", label: "Special notes", long: true }],
  },
];

export const campaignSections: Section[] = [
  {
    title: "Campaign",
    fields: [
      { key: "brandName", label: "Brand name" },
      { key: "campaignTitle", label: "Campaign title" },
      { key: "deliverables", label: "Deliverables", long: true },
      { key: "appearanceTime", label: "Appearance time" },
      { key: "appearanceDuration", label: "Appearance duration" },
      { key: "postingDate", label: "Posting date", type: "date" },
      { key: "contentFormat", label: "Content format" },
      { key: "captionRequirement", label: "Caption requirement", long: true },
      { key: "hashtags", label: "Hashtags" },
      { key: "tagsMentions", label: "Tags / mentions" },
      { key: "usageRights", label: "Usage rights", long: true },
      { key: "revisionRounds", label: "Revision rounds" },
      { key: "approvalDeadline", label: "Approval deadline", type: "date" },
      { key: "productDelivery", label: "Product delivery details", long: true },
      { key: "paymentStatus", label: "Payment status" },
      { key: "specialNotes", label: "Special notes", long: true },
    ],
  },
  {
    title: "Draft & post",
    blurb: "Links for draft approval and the live post.",
    clientEditable: true,
    fields: [
      { key: "draftLink", label: "Draft submission & approval link", long: true, placeholder: "https://…" },
      { key: "draftApproved", label: "Draft approved by client", type: "check", long: true },
      { key: "postLink", label: "Published post link", long: true, placeholder: "https://…" },
    ],
  },
];

export function sectionsFor(category: AdvanceCategory): Section[] {
  return category === "event" ? eventSections : campaignSections;
}

/** Keys the client may edit via the share link — the whitelist the save
 *  action enforces server-side, so it can't be bypassed from the browser. */
export function clientEditableKeys(category: AdvanceCategory): Set<string> {
  return new Set(
    sectionsFor(category)
      .filter((s) => s.clientEditable)
      .flatMap((s) => s.fields.map((f) => f.key))
  );
}

import type { ClientType } from "@/types";

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  venue: "Venue",
  brand: "Brand",
  agency: "Agency",
  promoter: "Promoter",
  private: "Private",
};

export const CLIENT_TYPES = Object.keys(CLIENT_TYPE_LABELS) as ClientType[];

"use client";

import * as React from "react";
import Link from "next/link";
import { FileSignature, Lock, Scale, ScrollText, Sparkles } from "lucide-react";

import { BodyPreview } from "@/components/forms/body-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { bookings, clients, currentUser, subscriptionPlans, templates } from "@/data";
import {
  CONTRACT_BODY_NOTICE,
  CONTRACT_REFERENCE_DISCLAIMER,
} from "@/lib/contracts";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { resolveTokens } from "@/lib/merge";

const NO_BOOKING = "none";

const contractTemplates = templates.filter(
  (t) => t.kind === "contract" && t.status === "published"
);

export function ContractBuilder() {
  const plan = subscriptionPlans.find((p) => p.id === currentUser.planId);
  const hasLegalReview = plan?.hasLegalReview ?? false;

  const [templateId, setTemplateId] = React.useState(contractTemplates[0].id);
  const [clientId, setClientId] = React.useState(clients[0].id);
  const [bookingId, setBookingId] = React.useState<string>(NO_BOOKING);

  // Client / company details — prefilled from the selected client, editable.
  const [clientDetails, setClientDetails] = React.useState({
    name: clients[0].name,
    company: clients[0].company ?? "",
    email: clients[0].email,
    phone: clients[0].phone ?? "",
    location: clients[0].location ?? "",
  });
  const [talentDetails, setTalentDetails] = React.useState({
    displayName: currentUser.displayName,
    businessName: currentUser.businessName ?? currentUser.name,
    email: currentUser.email,
  });

  const [body, setBody] = React.useState("");
  const [generatedAt, setGeneratedAt] = React.useState<Date | null>(null);
  const [savedAt, setSavedAt] = React.useState<Date | null>(null);
  const [reviewRequested, setReviewRequested] = React.useState(false);

  const template = contractTemplates.find((t) => t.id === templateId)!;

  function pickClient(id: string) {
    setClientId(id);
    const c = clients.find((x) => x.id === id);
    if (c) {
      setClientDetails({
        name: c.name,
        company: c.company ?? "",
        email: c.email,
        phone: c.phone ?? "",
        location: c.location ?? "",
      });
    }
  }

  function generate() {
    const booking = bookings.find((b) => b.id === bookingId);
    const context: Record<string, string> = {
      "client.name": clientDetails.name,
      "client.company": clientDetails.company || clientDetails.name,
      "client.email": clientDetails.email,
      "talent.displayName": talentDetails.displayName,
      "talent.businessName": talentDetails.businessName,
      "talent.email": talentDetails.email,
      "document.number": `CT-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 900) + 100
      )}`,
      "document.issueDate": new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
    if (booking) {
      context["booking.title"] = booking.title;
      context["booking.venueName"] = booking.venueName;
      context["booking.startTime"] = formatDateTime(booking.startTime);
      context["booking.fee"] = formatCurrency(booking.fee, booking.currency);
      context["document.total"] = formatCurrency(booking.fee, booking.currency);
    }
    setBody(`${resolveTokens(template.body, context)}\n\n${CONTRACT_BODY_NOTICE}`);
    setGeneratedAt(new Date());
    setSavedAt(null);
  }

  const clientItems = Object.fromEntries(clients.map((c) => [c.id, c.name]));
  const bookingItems: Record<string, string> = {
    [NO_BOOKING]: "No linked booking",
    ...Object.fromEntries(bookings.map((b) => [b.id, b.title])),
  };
  const templateItems = Object.fromEntries(
    contractTemplates.map((t) => [t.id, t.name])
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <Scale className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            For reference only.
          </span>{" "}
          {CONTRACT_REFERENCE_DISCLAIMER}
        </p>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Template</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Contract template</Label>
              <Select
                items={templateItems}
                value={templateId}
                onValueChange={(v) => v && setTemplateId(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contractTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Client & company details</CardTitle>
              <CardDescription>
                Pick a client, then amend any detail — your edits go straight
                into the contract.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select
                  items={clientItems}
                  value={clientId}
                  onValueChange={(v) => v && pickClient(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cb-client-name">Contact name</Label>
                  <Input
                    id="cb-client-name"
                    value={clientDetails.name}
                    onChange={(e) =>
                      setClientDetails({ ...clientDetails, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cb-client-company">Company</Label>
                  <Input
                    id="cb-client-company"
                    value={clientDetails.company}
                    onChange={(e) =>
                      setClientDetails({
                        ...clientDetails,
                        company: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cb-client-email">Email</Label>
                  <Input
                    id="cb-client-email"
                    value={clientDetails.email}
                    onChange={(e) =>
                      setClientDetails({
                        ...clientDetails,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cb-client-phone">Phone</Label>
                  <Input
                    id="cb-client-phone"
                    value={clientDetails.phone}
                    onChange={(e) =>
                      setClientDetails({
                        ...clientDetails,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Your details & booking</CardTitle>
              <CardDescription>
                How you appear as the artist party, and the booking this
                contract covers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="cb-talent-stage">Artist name</Label>
                  <Input
                    id="cb-talent-stage"
                    value={talentDetails.displayName}
                    onChange={(e) =>
                      setTalentDetails({
                        ...talentDetails,
                        displayName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cb-talent-business">Business name</Label>
                  <Input
                    id="cb-talent-business"
                    value={talentDetails.businessName}
                    onChange={(e) =>
                      setTalentDetails({
                        ...talentDetails,
                        businessName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cb-talent-email">Email</Label>
                  <Input
                    id="cb-talent-email"
                    value={talentDetails.email}
                    onChange={(e) =>
                      setTalentDetails({
                        ...talentDetails,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Linked booking</Label>
                <Select
                  items={bookingItems}
                  value={bookingId}
                  onValueChange={(v) => setBookingId(v ?? NO_BOOKING)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(bookingItems).map(([id, label]) => (
                      <SelectItem key={id} value={id}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Linking a booking auto-fills the event, venue, date, and fee.
                </p>
              </div>
              <Button onClick={generate}>
                <Sparkles className="size-4" />
                {body ? "Regenerate draft from details" : "Generate contract draft"}
              </Button>
              {body && generatedAt ? (
                <p className="text-xs text-muted-foreground">
                  Regenerating replaces any manual edits below with a fresh
                  draft from the template and the details above.
                </p>
              ) : null}
            </CardContent>
          </Card>

          {body ? (
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle>Contract content</CardTitle>
                <CardDescription>
                  Edit freely — highlighted {"{{fields.*}}"} placeholders still
                  need your input.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="edit">
                  <TabsList>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit" className="mt-3">
                    <Textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={24}
                      className="font-mono text-xs leading-relaxed"
                    />
                  </TabsContent>
                  <TabsContent value="preview" className="mt-3">
                    <BodyPreview body={body} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="space-y-5">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="size-4 text-primary" />
                Legal review
              </CardTitle>
              <CardDescription>
                Have a qualified professional review this contract before you
                send it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hasLegalReview ? (
                <>
                  <Badge variant="secondary">
                    Included in your {plan?.name} plan
                  </Badge>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={!body || reviewRequested}
                    onClick={() => setReviewRequested(true)}
                  >
                    <ScrollText className="size-4" />
                    {reviewRequested
                      ? "Review requested"
                      : "Request legal review"}
                  </Button>
                  {reviewRequested ? (
                    <p className="text-xs text-muted-foreground">
                      Request logged (prototype) — the review workflow ships
                      with the backend.
                    </p>
                  ) : !body ? (
                    <p className="text-xs text-muted-foreground">
                      Generate a draft first.
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                    <Lock className="size-4 shrink-0" />
                    Legal review & advice are available on Pro and Agency
                    plans.
                  </div>
                  <Button
                    className="w-full"
                    nativeButton={false}
                    render={<Link href="/dashboard/billing" />}
                  >
                    Upgrade to unlock
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button
              className="w-full"
              disabled={!body}
              onClick={() => setSavedAt(new Date())}
            >
              <FileSignature className="size-4" />
              Save contract draft
            </Button>
            {savedAt ? (
              <p className="text-center text-xs text-muted-foreground">
                Saved at {savedAt.toLocaleTimeString()} — prototype only,
                drafts aren't persisted yet.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

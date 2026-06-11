"use client";

import * as React from "react";
import { Plus, Save, Trash2 } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { subscriptionPlans } from "@/data";
import { templateTokenGroups } from "@/lib/template-tokens";
import type {
  DocumentTemplate,
  TemplateField,
  TemplateFieldType,
  TemplateKind,
} from "@/types";

const kindLabels: Record<TemplateKind, string> = {
  invoice: "Invoice",
  contract: "Contract",
  "advance-form": "Advance form",
};

const fieldTypeLabels: Record<TemplateFieldType, string> = {
  text: "Text",
  textarea: "Long text",
  number: "Number",
  currency: "Currency",
  date: "Date",
  time: "Time",
  select: "Dropdown",
};

const ALL_PLANS = "all";

const emptyTemplate = {
  name: "",
  description: "",
  kind: "contract" as TemplateKind,
  status: "draft" as const,
  isDefault: false,
  minPlanId: null,
  body: "",
  fields: [] as TemplateField[],
};

/** Renders the body with {{tokens}} highlighted. */
function BodyPreview({ body }: { body: string }) {
  const parts = body.split(/(\{\{[^}]+\}\})/g);
  return (
    <pre className="min-h-64 rounded-lg border bg-muted/30 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) =>
        part.startsWith("{{") ? (
          <span
            key={i}
            className="rounded bg-primary/10 px-1 py-0.5 font-medium text-primary"
          >
            {part}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </pre>
  );
}

export function TemplateEditor({ template }: { template?: DocumentTemplate }) {
  const initial = template ?? emptyTemplate;
  const [name, setName] = React.useState(initial.name);
  const [description, setDescription] = React.useState(initial.description);
  const [kind, setKind] = React.useState<TemplateKind>(initial.kind);
  const [published, setPublished] = React.useState(
    initial.status === "published"
  );
  const [isDefault, setIsDefault] = React.useState(initial.isDefault);
  const [minPlanId, setMinPlanId] = React.useState(
    initial.minPlanId ?? ALL_PLANS
  );
  const [body, setBody] = React.useState(initial.body);
  const [fields, setFields] = React.useState<TemplateField[]>(initial.fields);
  const [savedAt, setSavedAt] = React.useState<Date | null>(null);

  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  function insertToken(token: string) {
    const tag = `{{${token}}}`;
    const el = bodyRef.current;
    const start = el?.selectionStart ?? body.length;
    const end = el?.selectionEnd ?? start;
    setBody(body.slice(0, start) + tag + body.slice(end));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + tag.length, start + tag.length);
    });
  }

  function updateField(id: string, patch: Partial<TemplateField>) {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f))
    );
  }

  function addField() {
    setFields((prev) => [
      ...prev,
      {
        id: `tf-${Date.now()}`,
        key: "",
        label: "",
        type: "text",
        required: false,
      },
    ]);
  }

  const planItems: Record<string, string> = {
    [ALL_PLANS]: "All plans",
    ...Object.fromEntries(subscriptionPlans.map((p) => [p.id, p.name])),
  };

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tpl-name">Name</Label>
                <Input
                  id="tpl-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Performance Agreement"
                />
              </div>
              <div className="space-y-2">
                <Label>Kind</Label>
                <Select
                  items={kindLabels}
                  value={kind}
                  onValueChange={(value) => setKind(value as TemplateKind)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(kindLabels) as TemplateKind[]).map((k) => (
                      <SelectItem key={k} value={k}>
                        {kindLabels[k]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tpl-description">Description</Label>
              <Textarea
                id="tpl-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Shown to users when picking a template."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Body</CardTitle>
            <CardDescription>
              Write the document and insert merge tokens — they're filled in
              automatically when a user generates a document.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="edit">
              <TabsList>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="mt-3 space-y-3">
                <Textarea
                  ref={bodyRef}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={16}
                  className="font-mono text-xs leading-relaxed"
                  placeholder="Document body with {{merge.tokens}}…"
                />
                <div className="space-y-2">
                  {templateTokenGroups.map((group) => (
                    <div
                      key={group.group}
                      className="flex flex-wrap items-center gap-1.5"
                    >
                      <span className="w-20 text-xs font-medium text-muted-foreground">
                        {group.group}
                      </span>
                      {group.tokens.map((token) => (
                        <button
                          key={token}
                          type="button"
                          onClick={() => insertToken(token)}
                          className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20"
                        >
                          {token}
                        </button>
                      ))}
                    </div>
                  ))}
                  {fields.filter((f) => f.key).length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="w-20 text-xs font-medium text-muted-foreground">
                        Fields
                      </span>
                      {fields
                        .filter((f) => f.key)
                        .map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => insertToken(`fields.${f.key}`)}
                            className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-xs text-secondary-foreground transition-colors hover:bg-secondary/70"
                          >
                            fields.{f.key}
                          </button>
                        ))}
                    </div>
                  ) : null}
                </div>
              </TabsContent>
              <TabsContent value="preview" className="mt-3">
                <BodyPreview body={body} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Fill-in fields</CardTitle>
            <CardDescription>
              Questions the user answers when generating a document. Reference
              them in the body as {"{{fields.key}}"}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {fields.length === 0 ? (
              <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No fields yet — everything is auto-filled from merge tokens.
              </p>
            ) : (
              fields.map((field) => (
                <div
                  key={field.id}
                  className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_140px_auto_auto] sm:items-end"
                >
                  <div className="space-y-1.5">
                    <Label className="text-xs">Key</Label>
                    <Input
                      value={field.key}
                      onChange={(e) =>
                        updateField(field.id, { key: e.target.value })
                      }
                      placeholder="overtimeRate"
                      className="font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={field.label}
                      onChange={(e) =>
                        updateField(field.id, { label: e.target.value })
                      }
                      placeholder="Overtime rate"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Type</Label>
                    <Select
                      items={fieldTypeLabels}
                      value={field.type}
                      onValueChange={(value) =>
                        updateField(field.id, {
                          type: value as TemplateFieldType,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          Object.keys(fieldTypeLabels) as TemplateFieldType[]
                        ).map((t) => (
                          <SelectItem key={t} value={t}>
                            {fieldTypeLabels[t]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 pb-1.5">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) =>
                        updateField(field.id, { required: checked })
                      }
                    />
                    <span className="text-xs text-muted-foreground">
                      Required
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setFields((prev) =>
                        prev.filter((f) => f.id !== field.id)
                      )
                    }
                    aria-label="Remove field"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))
            )}
            <Button variant="outline" size="sm" onClick={addField}>
              <Plus className="size-4" />
              Add field
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-xs text-muted-foreground">
                  Visible to users when generating documents.
                </p>
              </div>
              <Switch checked={published} onCheckedChange={setPublished} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Default for kind</p>
                <p className="text-xs text-muted-foreground">
                  Pre-selected template for new {kindLabels[kind].toLowerCase()}{" "}
                  documents.
                </p>
              </div>
              <Switch checked={isDefault} onCheckedChange={setIsDefault} />
            </div>
            <div className="space-y-2">
              <Label>Minimum plan</Label>
              <Select
                items={planItems}
                value={minPlanId}
                onValueChange={(value) => setMinPlanId(value ?? ALL_PLANS)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(planItems).map(([id, label]) => (
                    <SelectItem key={id} value={id}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {template ? (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Version</span>
                <Badge variant="outline">v{template.version}</Badge>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Button className="w-full" onClick={() => setSavedAt(new Date())}>
            <Save className="size-4" />
            {template ? "Save changes" : "Create template"}
          </Button>
          {savedAt ? (
            <p className="text-center text-xs text-muted-foreground">
              Saved at {savedAt.toLocaleTimeString()} — prototype only, changes
              aren't persisted yet.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { CheckCircle2, FileUp, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TemplateKind } from "@/types";

const kindLabels: Record<TemplateKind, string> = {
  invoice: "Invoice",
  contract: "Contract",
  "advance-form": "Advance form",
};

/**
 * Prototype upload flow: accepts a file and "creates" a draft locally.
 * Real parsing (docx/pdf → editable template) lands with the backend.
 */
export function UploadTemplateDialog() {
  const [file, setFile] = React.useState<File | null>(null);
  const [kind, setKind] = React.useState<TemplateKind>("contract");
  const [done, setDone] = React.useState(false);

  function reset(open: boolean) {
    if (!open) {
      setFile(null);
      setDone(false);
    }
  }

  return (
    <Dialog onOpenChange={reset}>
      <DialogTrigger render={<Button variant="outline" />}>
        <Upload className="size-4" />
        Upload template
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a template</DialogTitle>
          <DialogDescription>
            Import an existing document (.docx or .pdf) and turn it into an
            editable template draft.
          </DialogDescription>
        </DialogHeader>
        {done ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-8 text-primary" />
            <div>
              <p className="text-sm font-medium">
                Draft created from “{file?.name}”
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Prototype note: nothing is persisted yet — file parsing and
                storage arrive with the backend.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-file">Document</Label>
              <label
                htmlFor="template-file"
                className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-center transition-colors hover:bg-muted/50"
              >
                <FileUp className="size-6 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {file ? file.name : "Click to choose a file"}
                </span>
                <span className="text-xs text-muted-foreground">
                  .docx or .pdf, up to 10 MB
                </span>
              </label>
              <Input
                id="template-file"
                type="file"
                accept=".docx,.pdf"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Template kind</Label>
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
        )}
        {!done ? (
          <DialogFooter>
            <Button disabled={!file} onClick={() => setDone(true)}>
              Create draft
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

"use client";

/**
 * A field that holds a URL, with a file picker attached.
 *
 * The value is still a plain text input, and still submits as one — the
 * inventory that ships with the site is written as paths under `/public`, and
 * a listing has to be able to point at one of those, at a Cloudinary URL, or
 * at anything else that resolves. The picker is a convenience over the top of
 * that, not a replacement for it: it uploads to Cloudinary and writes the
 * resulting URL into the same box somebody could have typed.
 *
 * The upload goes browser → Cloudinary directly, against a signature minted by
 * `requestUploadTicket`. Nothing here ever sees the API secret, and the file
 * never passes through the application.
 */

import { useRef, useState } from "react";
import { requestUploadTicket } from "@/app/lib/admin/upload-actions";
import type { ResourceType, UploadKind } from "@/app/lib/cloudinary";
import { Field, Input, Textarea } from "./ui";

/** What Cloudinary answers with; only the URL is of any use here. */
type CloudinaryResponse = { secure_url?: string; error?: { message?: string } };

function useUploader(resourceType: ResourceType, kind: UploadKind) {
  const [progress, setProgress] = useState<number | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const upload = async (file: File): Promise<string | null> => {
    setFailure(null);
    const ticket = await requestUploadTicket(resourceType, kind);
    if (!ticket.ok) {
      setFailure(ticket.error);
      return null;
    }

    const body = new FormData();
    body.set("file", file);
    body.set("api_key", ticket.ticket.apiKey);
    body.set("timestamp", String(ticket.ticket.timestamp));
    body.set("signature", ticket.ticket.signature);
    body.set("folder", ticket.ticket.folder);

    // XHR rather than fetch, for the one thing fetch cannot report: how far
    // through a large brochure the upload is.
    return new Promise((resolve) => {
      const request = new XMLHttpRequest();
      request.open("POST", ticket.ticket.endpoint);

      request.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      });

      const fail = (message: string) => {
        setProgress(null);
        setFailure(message);
        resolve(null);
      };

      request.addEventListener("load", () => {
        setProgress(null);
        let parsed: CloudinaryResponse = {};
        try {
          parsed = JSON.parse(request.responseText) as CloudinaryResponse;
        } catch {
          return fail("Cloudinary sent back something we could not read.");
        }
        if (request.status >= 200 && request.status < 300 && parsed.secure_url) {
          resolve(parsed.secure_url);
          return;
        }
        fail(parsed.error?.message ?? `Cloudinary returned ${request.status}.`);
      });

      request.addEventListener("error", () =>
        fail("The upload did not reach Cloudinary."),
      );
      request.addEventListener("abort", () => fail("The upload was cancelled."));

      setProgress(0);
      request.send(body);
    });
  };

  return { upload, progress, failure };
}

function PickButton({
  accept,
  multiple,
  progress,
  onFiles,
}: {
  accept: string;
  multiple?: boolean;
  progress: number | null;
  onFiles: (files: File[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const busy = progress !== null;

  return (
    <>
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={busy}
        className="shrink-0 rounded-md border border-ink/15 px-3 py-2 text-[12.5px] text-ink/80 transition-colors hover:border-ink/35 hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? `Uploading… ${progress}%` : multiple ? "Upload files" : "Upload"}
      </button>
      <input
        ref={input}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(event) => {
          const files = [...(event.target.files ?? [])];
          // Cleared so picking the same file twice still fires a change.
          event.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </>
  );
}

function Failure({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-[12px] leading-[18px] text-red-700">
      {message}
    </p>
  );
}

/** One URL: a card image, a brochure. */
export function UploadField({
  name,
  label,
  hint,
  error,
  accept,
  resourceType,
  kind = "property",
  defaultValue,
  placeholder,
  required,
  preview = true,
  previewRatio,
}: {
  name: string;
  label: string;
  hint?: React.ReactNode;
  error?: string;
  accept: string;
  resourceType: ResourceType;
  /** Which folder the file lands in. */
  kind?: UploadKind;
  defaultValue: string;
  placeholder?: string;
  required?: boolean;
  /** Off for a brochure, where there is nothing to look at. */
  preview?: boolean;
  /**
   * An aspect ratio — "3/2", "8/3" — for the thumbnail, where the shape of the
   * crop is part of what the editor is choosing. Without it the preview is a
   * fixed box, which is enough for a listing photograph.
   */
  previewRatio?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const { upload, progress, failure } = useUploader(resourceType, kind);

  return (
    <Field label={label} name={name} error={error} hint={hint} required={required}>
      <div className="grid gap-2">
        <div className="flex gap-2">
          <Input
            id={name}
            name={name}
            value={value}
            error={error}
            placeholder={placeholder}
            required={required}
            // An input carries an intrinsic minimum width; without this the
            // pair overflows the article form's 300px sidebar.
            className="min-w-0"
            onChange={(event) => setValue(event.target.value)}
          />
          <PickButton
            accept={accept}
            progress={progress}
            onFiles={async ([file]) => {
              const url = await upload(file);
              if (url) setValue(url);
            }}
          />
        </div>

        <Failure message={failure} />

        {preview && value ? (
          // A plain <img>: this is the dashboard, the source is arbitrary, and
          // `next/image` would need every host allow-listed to show a preview
          // — and answers a mistyped path with a 400 in the console rather
          // than the broken-image icon that tells the editor what is wrong.
          previewRatio ? (
            <span
              className="block overflow-hidden rounded-[4px] border border-ink/10 bg-ink/5"
              style={{ aspectRatio: previewRatio }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="" className="size-full object-cover" />
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-24 w-40 rounded-md border border-ink/10 object-cover"
            />
          )
        ) : null}

        {!preview && value ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="w-fit text-[12px] text-forest underline underline-offset-2"
          >
            Open the file
          </a>
        ) : null}
      </div>
    </Field>
  );
}

/** Many URLs, one per line — the gallery, the floor plans. */
export function UploadList({
  name,
  label,
  hint,
  error,
  accept,
  resourceType,
  kind = "property",
  defaultValue,
  rows = 4,
}: {
  name: string;
  label: string;
  hint?: React.ReactNode;
  error?: string;
  accept: string;
  resourceType: ResourceType;
  kind?: UploadKind;
  defaultValue: string[];
  rows?: number;
}) {
  const [value, setValue] = useState(defaultValue.join("\n"));
  const { upload, progress, failure } = useUploader(resourceType, kind);
  const items = value.split("\n").map((line) => line.trim()).filter(Boolean);

  return (
    <Field label={label} name={name} error={error} hint={hint}>
      <div className="grid gap-2">
        <Textarea
          id={name}
          name={name}
          value={value}
          error={error}
          rows={rows}
          className="font-mono text-[13px]"
          onChange={(event) => setValue(event.target.value)}
        />

        <div className="flex items-center gap-2">
          <PickButton
            accept={accept}
            multiple
            progress={progress}
            onFiles={async (files) => {
              // Sequential on purpose: each upload needs its own signature,
              // and a lister adding twenty photographs on hotel wifi is better
              // served by a queue than by twenty stalled requests.
              for (const file of files) {
                const url = await upload(file);
                if (!url) break;
                setValue((current) =>
                  current.trim() ? `${current.trimEnd()}\n${url}` : url,
                );
              }
            }}
          />
          <span className="text-[12px] text-ink/50">
            {items.length === 1 ? "1 file" : `${items.length} files`}
          </span>
        </div>

        <Failure message={failure} />

        {items.length ? (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item}
                src={item}
                alt=""
                className="h-16 w-24 rounded-md border border-ink/10 object-cover"
              />
            ))}
          </div>
        ) : null}
      </div>
    </Field>
  );
}

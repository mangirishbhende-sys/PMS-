import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { finalizeReviewAction } from "@/lib/actions";
import type { Review } from "@/lib/types";

export function FinalizeReviewForm({ review }: { review: Review }) {
  if (review.status === "finalized") {
    return <p className="text-sm text-slate-500">This report is already finalized.</p>;
  }
  return (
    <form action={finalizeReviewAction} className="space-y-4">
      <input type="hidden" name="id" value={review.id} />
      <div className="space-y-2">
        <Label htmlFor={`hrNotes-${review.id}`}>HR notes</Label>
        <Textarea
          id={`hrNotes-${review.id}`}
          name="hrNotes"
          rows={4}
          defaultValue={review.hrNotes ?? ""}
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
      >
        Finalize and email employee
      </button>
    </form>
  );
}

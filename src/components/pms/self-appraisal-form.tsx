import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSelfAppraisalAction } from "@/lib/actions";
import { RATING_SCALE } from "@/lib/types";
import type { Review } from "@/lib/types";

export function SelfAppraisalForm({ review }: { review: Review }) {
  const locked = review.status === "submitted" || review.status === "manager_reviewed" || review.status === "finalized";
  return (
    <form action={saveSelfAppraisalAction} className="space-y-4">
      <input type="hidden" name="id" value={review.id} />
      <div className="space-y-2">
        <Label htmlFor="selfRating">Self rating</Label>
        <select
          id="selfRating"
          name="selfRating"
          required
          disabled={locked}
          defaultValue={review.selfRating ?? 3}
          className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          {RATING_SCALE.map((item) => (
            <option key={item.value} value={item.value}>
              {item.value} · {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="selfComments">Narrative</Label>
        <Textarea
          id="selfComments"
          name="selfComments"
          rows={6}
          disabled={locked}
          defaultValue={review.selfComments ?? ""}
          placeholder="What you delivered, what blocked you, and what you will do next."
        />
      </div>
      {locked ? (
        <p className="text-sm text-slate-500">This appraisal is locked because it has already been submitted.</p>
      ) : (
        <div className="flex gap-3">
          <button
            type="submit"
            name="intent"
            value="save"
            className="inline-flex h-8 items-center rounded-lg border border-border bg-white px-3 text-sm"
          >
            Save draft
          </button>
          <button
            type="submit"
            name="intent"
            value="submit"
            className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm text-primary-foreground"
          >
            Submit to manager
          </button>
        </div>
      )}
    </form>
  );
}

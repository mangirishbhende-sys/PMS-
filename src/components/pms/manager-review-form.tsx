import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveManagerReviewAction } from "@/lib/actions";
import { RATING_SCALE } from "@/lib/types";
import type { Review } from "@/lib/types";

export function ManagerReviewForm({ review }: { review: Review }) {
  const locked = review.status === "finalized";
  return (
    <form action={saveManagerReviewAction} className="space-y-4">
      <input type="hidden" name="id" value={review.id} />
      <div className="space-y-2">
        <Label htmlFor={`managerRating-${review.id}`}>Manager rating</Label>
        <select
          id={`managerRating-${review.id}`}
          name="managerRating"
          required
          disabled={locked}
          defaultValue={review.managerRating ?? 3}
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
        <Label htmlFor={`managerComments-${review.id}`}>Manager comments</Label>
        <Textarea
          id={`managerComments-${review.id}`}
          name="managerComments"
          rows={5}
          disabled={locked}
          defaultValue={review.managerComments ?? ""}
        />
      </div>
      {locked ? null : (
        <button
          type="submit"
          className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
        >
          Save manager review
        </button>
      )}
    </form>
  );
}

import type { Review } from '../context/SiteContext';

type ReviewBylineProps = {
  review: Review;
  className?: string;
};

export const getReviewDisplayName = (review: Pick<Review, 'reviewerName'>) => {
  const name = review.reviewerName?.trim();

  if (!name || name.toLowerCase() === 'airbnb guest') {
    return 'Airbnb reviewer';
  }

  return name;
};

const getInitials = (name: string) => (
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'A'
);

export default function ReviewByline({ review, className = '' }: ReviewBylineProps) {
  const name = getReviewDisplayName(review);
  const avatar = review.reviewerAvatar?.trim();
  const content = (
    <>
      {avatar ? (
        <img
          loading="lazy"
          decoding="async"
          src={avatar}
          alt={`${name} profile`}
          className="h-11 w-11 shrink-0 rounded-full border border-divider-subtle bg-background-dark object-cover"
        />
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-divider-subtle bg-background-dark text-xs font-bold text-primary">
          {getInitials(name)}
        </div>
      )}
      <div className="min-w-0">
        <div className="font-bold text-sm tracking-wide text-primary">{name}</div>
        <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">{review.reviewerRole}</div>
      </div>
    </>
  );

  if (review.reviewerProfileUrl) {
    return (
      <a
        href={review.reviewerProfileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3 ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {content}
    </div>
  );
}

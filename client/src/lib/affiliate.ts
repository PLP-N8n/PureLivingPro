export function buildAffiliateUrl(params: { affiliateId?: string | number | null; url?: string | null; contentId?: string | number | null }) {
  const { affiliateId, url, contentId } = params || {};
  if (affiliateId !== undefined && affiliateId !== null && `${affiliateId}`.trim() !== "") {
    const cid = contentId !== undefined && contentId !== null && `${contentId}`.trim() !== "" ? `?contentId=${encodeURIComponent(String(contentId))}` : "";
    return `/r/${encodeURIComponent(String(affiliateId))}${cid}`;
  }
  return url ?? "#";
}

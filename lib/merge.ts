/**
 * Resolves {{merge.tokens}} in a template body against a context of
 * dot-keyed values (e.g. "client.name"). Tokens without a value — such as
 * {{fields.*}} the user still needs to fill in — are left in place so they
 * stay visible and editable in the generated draft.
 */
export function resolveTokens(
  body: string,
  context: Record<string, string>
): string {
  return body.replace(/\{\{([^}]+)\}\}/g, (match, rawKey: string) => {
    const value = context[rawKey.trim()];
    return value !== undefined && value !== "" ? value : match;
  });
}

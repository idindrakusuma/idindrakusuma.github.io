/**
 * Structured data for search engines: a schema.org object as a JSON-LD script.
 * `<` is escaped so no string in the data can close the script tag.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

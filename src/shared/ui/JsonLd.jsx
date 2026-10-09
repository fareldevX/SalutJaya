/** Data terstruktur schema.org untuk mesin pencari. `<` di-escape agar aman disisipkan sebagai JSON. */
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

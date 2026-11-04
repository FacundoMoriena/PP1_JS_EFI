export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-6 text-center text-xs text-zinc-500 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          ITEC Río Cuarto — <strong>Práctica Profesionalizante 1</strong> (Python & JavaScript)
        </p>
        <p>
          Integrantes: <strong className="text-zinc-400">Facundo Albornoz — Facundo Moriena</strong>
        </p>
      </div>
    </footer>
  );
}

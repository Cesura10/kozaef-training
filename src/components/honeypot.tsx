/**
 * Campo trampa (brief seguridad §B4): invisible para personas y lectores de pantalla,
 * los bots lo rellenan. El servidor descarta en silencio los envíos que lo traigan relleno.
 */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

/** true si el envío viene de un bot (campo trampa relleno). */
export const isBot = (website: unknown) => typeof website === 'string' && website.length > 0;

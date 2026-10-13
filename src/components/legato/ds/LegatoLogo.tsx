import logo from "../../../../ajouts-2/assets/logo-legato.png";
import creamLogo from "../../../../ajouts-2/assets/logo-legato-creme.png";

export function LegatoLogo({ night = false }: { night?: boolean }) {
  return <img src={night ? creamLogo : logo} alt="LEGATO" width={66} className="block h-auto w-[66px] shrink-0" />;
}
/** La veillée de la capture est un exemple, pas un rendez-vous confirmé. */
export const VIGIL = { id: "premier-mois", title: "Le premier mois, en parler ensemble.", when: "Jeudi 1er octobre, 20 h", duration: "Une heure", where: "En visio, caméra facultative", host: "Une psychologue", remaining: 7 };
export function vigilCalendar() {
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Legato//Veillee exemple//FR", "BEGIN:VEVENT", "UID:legato-premier-mois-example", "DTSTAMP:20261001T000000Z", "DTSTART:20261001T180000Z", "DTEND:20261001T190000Z", "SUMMARY:Veillée Legato — exemple non confirmé", "DESCRIPTION:Date de la maquette. Aucune réservation ni visio confirmée.", "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
}

import React, { useId } from "react";
import { AVATARS } from "../../data/mockData";
import drRani from "../../assets/astrologers/dr-rani.png";
import arjunSharma from "../../assets/astrologers/arjun-sharma.png";
import nandiniKapoor from "../../assets/astrologers/nandini-kapoor.png";
import acharyaMeena from "../../assets/astrologers/acharya-meena.png";
import priyaSharma from "../../assets/astrologers/priya-sharma.png";
import devMalhotra from "../../assets/astrologers/dev-malhotra.png";
import ishitaSen from "../../assets/astrologers/ishita-sen.png";
import ruWoman40 from "../../assets/astrologers/randomuser-women-40.jpg";
import ruMan86 from "../../assets/astrologers/randomuser-men-86.jpg";
import ruMan12 from "../../assets/astrologers/randomuser-men-12.jpg";

// Photos for every astrologer. Seven were supplied with a status dot in the corner (cropped by a slight zoom);
// the last three are placeholder portraits from randomuser.me (7, 8, 9) and are shown as they are.
const PHOTOS = { 0: drRani, 1: arjunSharma, 2: nandiniKapoor, 3: acharyaMeena, 4: priyaSharma, 5: devMalhotra, 6: ishitaSen, 7: ruMan86, 8: ruWoman40, 9: ruMan12 };
const NO_ZOOM = { 7: true, 8: true, 9: true };
import "./AstroAvatar.css";

// Portrait for an astrologer: a supplied photo where there is one, otherwise a portrait drawn in code from a few traits.
function AstroAvatar({ id, size = 52, name = "" }) {
  const uid = useId().replace(/:/g, "");
  const photo = PHOTOS[id];
  if (photo) {
    // The supplied photos have a small status dot in the corner; the slight zoom crops it out.
    return (
      <span className={"astro-avatar astro-photo" + (NO_ZOOM[id] ? " nz" : "")} style={{ width: size, height: size }}>
        <img src={photo} width={size} height={size} alt={name ? name + " portrait" : "Astrologer portrait"} />
      </span>
    );
  }
  const c = AVATARS[id] || AVATARS[0];
  const hair = c.hair, skin = c.skin, shade = c.shade;
  const longHair = c.style === "long" || c.style === "wavy";
  return (
    <svg className="astro-avatar" width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={name ? name + " portrait" : "Astrologer portrait"}>
      <defs>
        <linearGradient id={"bg" + uid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.bg[0]} />
          <stop offset="1" stopColor={c.bg[1]} />
        </linearGradient>
        <clipPath id={"cp" + uid}><circle cx="50" cy="50" r="50" /></clipPath>
      </defs>
      <g clipPath={"url(#cp" + uid + ")"}>
        <rect width="100" height="100" fill={"url(#bg" + uid + ")"} />
        {longHair ? <path d="M29 46 C26 14 74 14 71 46 L74 86 Q50 96 26 86 Z" fill={hair} /> : null}
        {c.style === "bun" ? <circle cx="50" cy="15" r="8" fill={hair} /> : null}
        <path d="M8 100 C10 84 30 76 50 76 C70 76 90 84 92 100 Z" fill={c.outfit} />
        <path d="M42 77 L50 90 L58 77 Z" fill={skin} />
        <path d="M43 60 h14 v17 q-7 5 -14 0 Z" fill={shade} />
        <ellipse cx="33" cy="48" rx="3" ry="5" fill={skin} />
        <ellipse cx="67" cy="48" rx="3" ry="5" fill={skin} />
        {c.earrings ? <><circle cx="33" cy="54" r="1.6" fill="#e0b341" /><circle cx="67" cy="54" r="1.6" fill="#e0b341" /></> : null}
        <ellipse cx="50" cy="46" rx="17" ry="20" fill={skin} />
        {c.style === "older" ? (
          <>
            <path d="M33 44 C31 34 36 28 42 27 C38 31 36 36 36 42 Z" fill={hair} />
            <path d="M67 44 C69 34 64 28 58 27 C62 31 64 36 64 42 Z" fill={hair} />
          </>
        ) : (
          <path d={c.style === "wavy" ? "M32 42 C28 18 72 18 68 42 C66 32 60 28 50 28 C40 28 34 32 32 42 Z" : "M33 41 C31 21 69 21 67 41 C64 31 58 29 50 29 C42 29 36 31 33 41 Z"} fill={hair} />
        )}
        <path d="M38 40 q4.5 -3 9 0 M53 40 q4.5 -3 9 0" fill="none" stroke={hair} strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="42.5" cy="45.5" rx="2.8" ry="1.7" fill="#fff" />
        <ellipse cx="57.5" cy="45.5" rx="2.8" ry="1.7" fill="#fff" />
        <circle cx="42.5" cy="45.5" r="1.4" fill="#2a1a12" />
        <circle cx="57.5" cy="45.5" r="1.4" fill="#2a1a12" />
        {c.glasses ? <path d="M36.5 45.5 a6 5 0 1 0 12 0 a6 5 0 1 0 -12 0 M51.5 45.5 a6 5 0 1 0 12 0 a6 5 0 1 0 -12 0 M48.5 45.5 h3" fill="none" stroke="#2a2430" strokeWidth="1.3" /> : null}
        <path d="M50 46 q-2.2 7 0 9 q2 1.4 4.4 0" fill="none" stroke={shade} strokeWidth="1.4" strokeLinecap="round" />
        {c.beard === "full" ? <path d="M33 50 C33 72 67 72 67 50 C63 64 37 64 33 50 Z" fill={hair} /> : null}
        {c.beard === "short" ? <path d="M33 52 C34 68 66 68 67 52 C63 61 37 61 33 52 Z" fill={hair} opacity=".9" /> : null}
        {c.beard === "mustache" || c.beard === "full" || c.beard === "short" ? <path d="M43 56 q7 -4 14 0 q-7 3 -14 0 Z" fill={hair} /> : null}
        <path d={c.female ? "M44.5 59.5 q5.5 4 11 0 q-5.5 1.5 -11 0 Z" : "M45 60 q5 3 10 0"} fill={c.female ? "#b04a55" : "none"} stroke={c.female ? "none" : "#7a3b2e"} strokeWidth="1.5" strokeLinecap="round" />
        {c.bindi ? <circle cx="50" cy="36.5" r="1.5" fill="#c0262d" /> : null}
        {c.tilak ? <path d="M50 31.5 v8" stroke="#d8452f" strokeWidth="1.7" strokeLinecap="round" /> : null}
        {c.vibhuti ? <path d="M43 33 h14 M43.5 35.4 h13 M44 37.8 h12" stroke="#f2efe9" strokeWidth="1.1" strokeLinecap="round" opacity=".9" /> : null}
      </g>
    </svg>
  );
}

export default AstroAvatar;

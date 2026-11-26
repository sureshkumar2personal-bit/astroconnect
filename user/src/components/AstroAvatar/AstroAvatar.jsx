import React from "react";
import drRani from "../../assets/astrologers/dr-rani.png";
import arjunSharma from "../../assets/astrologers/arjun-sharma.png";
import nandiniKapoor from "../../assets/astrologers/nandini-kapoor.png";
import acharyaMeena from "../../assets/astrologers/acharya-meena.png";
import priyaSharma from "../../assets/astrologers/priya-sharma.png";
import devMalhotra from "../../assets/astrologers/dev-malhotra.png";
import ishitaSen from "../../assets/astrologers/ishita-sen.png";

// Every astrologer has a photo. Seven were supplied (with a status dot in the corner, cropped by a slight zoom);
// the rest reuse them, matched by gender. Any id not listed falls back to one of the seven by id.
const PHOTOS = { 0: drRani, 1: arjunSharma, 2: nandiniKapoor, 3: acharyaMeena, 4: priyaSharma, 5: devMalhotra, 6: ishitaSen, 7: arjunSharma, 8: nandiniKapoor, 9: devMalhotra, 10: priyaSharma, 11: acharyaMeena, 12: ishitaSen, 13: arjunSharma };
const ALL = [drRani, arjunSharma, nandiniKapoor, acharyaMeena, priyaSharma, devMalhotra, ishitaSen];
import "./AstroAvatar.css";

// Portrait for an astrologer.
function AstroAvatar({ id, size = 52, name = "" }) {
  const photo = PHOTOS[id] || ALL[Math.abs(Number(id) || 0) % ALL.length];
  return (
    <span className="astro-avatar astro-photo" style={{ width: size, height: size }}>
      <img src={photo} width={size} height={size} alt={name ? name + " portrait" : "Astrologer portrait"} />
    </span>
  );
}

export default AstroAvatar;

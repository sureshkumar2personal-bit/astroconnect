// Original design assets, referenced in place from astrologer/asst/.
import lightLogo from '../../../asst/light mood/Astro Converse Golden Zodiac Logo.png';
import lightArt from '../../../asst/light mood/Astro Converse Mountain Zodiac Sidebar.png';
import darkLogo from '../../../asst/darkmood/Astro Converse Zodiac Emblem Logo.png';
import darkArt from '../../../asst/darkmood/Starry Purple Mountain Nebula.png';
import lightBg from '../../../asst/light mood/Golden Zodiac Sunrise Over Misty Mountains.png';
import lightBgMobile from '../../../asst/light mood/Golden Moonrise Over Misty Mountains.png';

// bg: dashboard background on desktop/tablet. bgMobile: full-page background on mobile.
// Dark has a single (portrait) background asset, used for both.
export const themeAssets = {
  light: { logo: lightLogo, art: lightArt, bg: lightBg, bgMobile: lightBgMobile },
  dark: { logo: darkLogo, art: darkArt, bg: darkArt, bgMobile: darkArt },
};

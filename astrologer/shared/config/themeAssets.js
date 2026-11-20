// Theme images, from astrologer/assets/images/.
import lightLogo from '@assets/images/light/logo-golden-zodiac.png';
import lightArt from '@assets/images/light/sidebar-mountain-zodiac.png';
import darkLogo from '@assets/images/dark/logo-emblem.png';
import darkArt from '@assets/images/dark/bg-nebula.png';
import lightBg from '@assets/images/light/bg-zodiac-sunrise.png';
import lightBgMobile from '@assets/images/light/bg-moonrise-mobile.png';

// bg: dashboard background on desktop/tablet. bgMobile: full-page background on mobile.
// Dark has a single (portrait) background asset, used for both.
export const themeAssets = {
  light: { logo: lightLogo, art: lightArt, bg: lightBg, bgMobile: lightBgMobile },
  dark: { logo: darkLogo, art: darkArt, bg: darkArt, bgMobile: darkArt },
};

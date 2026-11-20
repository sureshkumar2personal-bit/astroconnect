import { themeAssets } from '../data/assets.js';

export default function Logo({ theme, className = '' }) {
  return <img src={themeAssets[theme].logo} alt="Astro Converse — Your stars, your story" className={`ac-logo ${className}`} />;
}

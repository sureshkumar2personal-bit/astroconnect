import React, { useId } from "react";
import figure from "../../assets/images/hero-figure.webp";
import "./HeroWheel.css";

// Rotating zodiac wheel for the Home hero. It sits between the sky photo and a cutout of the
// meditating figure, so the figure stays in front while the wheel turns behind it.
// Coordinates use the hero photo's own size (1400 x 466); the wheel centre is at (1015, 236).
function HeroWheel() {
  const uid = useId().replace(/:/g, "");
  return (
    <>
      <svg className="hero-wheel" viewBox="0 0 1400 466" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={"disc" + uid} cx="1015" cy="236" r="172" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff4ff" />
            <stop offset="0.07" stopColor="#f6d2ff" />
            <stop offset="0.17" stopColor="#c07af5" />
            <stop offset="0.36" stopColor="#7a3dd6" />
            <stop offset="0.6" stopColor="#4a22a8" />
            <stop offset="0.86" stopColor="#2c1186" />
            <stop offset="1" stopColor="#2c1186" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="1015" cy="236" r="172" fill={"url(#disc" + uid + ")"} />
        <g className="hw-fx">
          <g className="hw-inner">
            <circle cx="1015" cy="236" r="84" />
            <circle cx="1015" cy="236" r="62" strokeDasharray="3 5" />
            <path d="M1097.0 236.0L1107.0 236.0M1096.7 243.1L1102.7 243.7M1095.8 250.2L1101.7 251.3M1094.2 257.2L1100.0 258.8M1092.1 264.0L1097.7 266.1M1089.3 270.7L1094.8 273.2M1086.0 277.0L1094.7 282.0M1082.2 283.0L1087.1 286.5M1077.8 288.7L1082.4 292.6M1073.0 294.0L1077.2 298.2M1067.7 298.8L1071.6 303.4M1062.0 303.2L1065.5 308.1M1056.0 307.0L1061.0 315.7M1049.7 310.3L1052.2 315.8M1043.0 313.1L1045.1 318.7M1036.2 315.2L1037.8 321.0M1029.2 316.8L1030.3 322.7M1022.1 317.7L1022.7 323.7M1015.0 318.0L1015.0 328.0M1007.9 317.7L1007.3 323.7M1000.8 316.8L999.7 322.7M993.8 315.2L992.2 321.0M987.0 313.1L984.9 318.7M980.3 310.3L977.8 315.8M974.0 307.0L969.0 315.7M968.0 303.2L964.5 308.1M962.3 298.8L958.4 303.4M957.0 294.0L952.8 298.2M952.2 288.7L947.6 292.6M947.8 283.0L942.9 286.5M944.0 277.0L935.3 282.0M940.7 270.7L935.2 273.2M937.9 264.0L932.3 266.1M935.8 257.2L930.0 258.8M934.2 250.2L928.3 251.3M933.3 243.1L927.3 243.7M933.0 236.0L923.0 236.0M933.3 228.9L927.3 228.3M934.2 221.8L928.3 220.7M935.8 214.8L930.0 213.2M937.9 208.0L932.3 205.9M940.7 201.3L935.2 198.8M944.0 195.0L935.3 190.0M947.8 189.0L942.9 185.5M952.2 183.3L947.6 179.4M957.0 178.0L952.8 173.8M962.3 173.2L958.4 168.6M968.0 168.8L964.5 163.9M974.0 165.0L969.0 156.3M980.3 161.7L977.8 156.2M987.0 158.9L984.9 153.3M993.8 156.8L992.2 151.0M1000.8 155.2L999.7 149.3M1007.9 154.3L1007.3 148.3M1015.0 154.0L1015.0 144.0M1022.1 154.3L1022.7 148.3M1029.2 155.2L1030.3 149.3M1036.2 156.8L1037.8 151.0M1043.0 158.9L1045.1 153.3M1049.7 161.7L1052.2 156.2M1056.0 165.0L1061.0 156.3M1062.0 168.8L1065.5 163.9M1067.7 173.2L1071.6 168.6M1073.0 178.0L1077.2 173.8M1077.8 183.3L1082.4 179.4M1082.2 189.0L1087.1 185.5M1086.0 195.0L1094.7 190.0M1089.3 201.3L1094.8 198.8M1092.1 208.0L1097.7 205.9M1094.2 214.8L1100.0 213.2M1095.8 221.8L1101.7 220.7M1096.7 228.9L1102.7 228.3" />
            <path className="hw-ray" d="M1058.8 231.4L1093.0 236.0L1058.8 240.6M1055.2 253.9L1082.5 275.0L1050.6 261.9M1040.9 271.6L1054.0 303.5L1032.9 276.2M1019.6 279.8L1015.0 314.0L1010.4 279.8M997.1 276.2L976.0 303.5L989.1 271.6M979.4 261.9L947.5 275.0L974.8 253.9M971.2 240.6L937.0 236.0L971.2 231.4M974.8 218.1L947.5 197.0L979.4 210.1M989.1 200.4L976.0 168.5L997.1 195.8M1010.4 192.2L1015.0 158.0L1019.6 192.2M1032.9 195.8L1054.0 168.5L1040.9 200.4M1050.6 210.1L1082.5 197.0L1055.2 218.1" />
          </g>
          <g className="hw-ring">
            <circle cx="1015" cy="236" r="142" strokeWidth="1.8" />
            <circle cx="1015" cy="236" r="146" strokeWidth="0.6" />
            <circle cx="1015" cy="236" r="116" />
          <line x1="1063.0" y1="152.9" x2="1086.0" y2="113.0" />
          <line x1="1098.1" y1="188.0" x2="1138.0" y2="165.0" />
          <line x1="1111.0" y1="236.0" x2="1157.0" y2="236.0" />
          <line x1="1098.1" y1="284.0" x2="1138.0" y2="307.0" />
          <line x1="1063.0" y1="319.1" x2="1086.0" y2="359.0" />
          <line x1="1015.0" y1="332.0" x2="1015.0" y2="378.0" />
          <line x1="967.0" y1="319.1" x2="944.0" y2="359.0" />
          <line x1="931.9" y1="284.0" x2="892.0" y2="307.0" />
          <line x1="919.0" y1="236.0" x2="873.0" y2="236.0" />
          <line x1="931.9" y1="188.0" x2="892.0" y2="165.0" />
          <line x1="967.0" y1="152.9" x2="944.0" y2="113.0" />
          <line x1="1015.0" y1="140.0" x2="1015.0" y2="94.0" />
          <text className="hw-glyph" x="1048.1" y="112.4" textAnchor="middle" dominantBaseline="central">♈&#xFE0E;</text>
          <text className="hw-glyph" x="1105.5" y="145.5" textAnchor="middle" dominantBaseline="central">♉&#xFE0E;</text>
          <text className="hw-glyph" x="1138.6" y="202.9" textAnchor="middle" dominantBaseline="central">♊&#xFE0E;</text>
          <text className="hw-glyph" x="1138.6" y="269.1" textAnchor="middle" dominantBaseline="central">♋&#xFE0E;</text>
          <text className="hw-glyph" x="1105.5" y="326.5" textAnchor="middle" dominantBaseline="central">♌&#xFE0E;</text>
          <text className="hw-glyph" x="1048.1" y="359.6" textAnchor="middle" dominantBaseline="central">♍&#xFE0E;</text>
          <text className="hw-glyph" x="981.9" y="359.6" textAnchor="middle" dominantBaseline="central">♎&#xFE0E;</text>
          <text className="hw-glyph" x="924.5" y="326.5" textAnchor="middle" dominantBaseline="central">♏&#xFE0E;</text>
          <text className="hw-glyph" x="891.4" y="269.1" textAnchor="middle" dominantBaseline="central">♐&#xFE0E;</text>
          <text className="hw-glyph" x="891.4" y="202.9" textAnchor="middle" dominantBaseline="central">♑&#xFE0E;</text>
          <text className="hw-glyph" x="924.5" y="145.5" textAnchor="middle" dominantBaseline="central">♒&#xFE0E;</text>
          <text className="hw-glyph" x="981.9" y="112.4" textAnchor="middle" dominantBaseline="central">♓&#xFE0E;</text>
          </g>
          <circle cx="1015" cy="236" r="40" strokeWidth="1.4" opacity="0.8" />
          <circle cx="1015" cy="236" r="52" strokeWidth="0.8" opacity="0.6" />
        </g>
      </svg>
      <img className="hero-figure" src={figure} alt="" aria-hidden="true" />
    </>
  );
}

export default HeroWheel;

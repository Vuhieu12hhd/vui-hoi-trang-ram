export default function MoonFestivalCharacters() {
  return (
    <div className="festival-characters" aria-hidden="true">
      <figure className="festival-character cuoi-character">
        <svg viewBox="0 0 210 260" role="img">
          <defs>
            <linearGradient id="cuoiAo" x1="0" x2="1">
              <stop offset="0" stopColor="#315f3b" />
              <stop offset="1" stopColor="#79b86a" />
            </linearGradient>
            <linearGradient id="treeGlow" x1="0" x2="1">
              <stop offset="0" stopColor="#f2c766" />
              <stop offset="1" stopColor="#fff2b2" />
            </linearGradient>
          </defs>
          <path className="character-shadow" d="M30 236c28-16 112-18 152 1-28 20-122 19-152-1Z" />
          <path className="banyan-trunk" d="M44 215c17-34 29-61 28-96 18 23 27 51 11 100Z" />
          <path className="banyan-leaf leaf-a" d="M40 85c9-36 58-45 80-20 30-20 70 2 65 37-2 25-30 42-58 29-23 25-72 14-87-17-24 9-45-14-34-37 8-17 25-24 34-22Z" />
          <path className="banyan-leaf leaf-b" d="M81 58c5-28 46-36 63-14 24-10 49 8 48 33-1 27-28 43-54 35-20 17-53 8-62-15-23 1-37-19-27-39 7-13 21-19 32 0Z" />
          <path className="character-body" fill="url(#cuoiAo)" d="M95 137c-24 9-38 31-41 73h91c-3-41-17-65-50-73Z" />
          <path className="character-sleeve" d="M58 165c-16 9-27 28-33 51 11 6 25 1 32-13 5-11 10-21 20-27Z" />
          <path className="character-sleeve right" d="M138 165c19 8 32 25 40 47-9 9-25 7-35-6-7-10-13-21-24-28Z" />
          <circle className="character-face" cx="99" cy="111" r="31" />
          <path className="character-hair" d="M68 105c3-30 28-50 57-36 17 8 24 23 22 40-17-14-42-16-79-4Z" />
          <circle className="character-eye" cx="88" cy="113" r="3.6" />
          <circle className="character-eye" cx="111" cy="113" r="3.6" />
          <path className="character-smile" d="M91 126c6 6 15 6 21 0" />
          <path className="character-leg" d="M73 210c-9 9-14 20-15 32h27l16-32Z" />
          <path className="character-leg right" d="M122 210c11 8 19 19 22 32h-28l-17-32Z" />
          <path className="moon-thread" d="M153 64c-9 28-24 49-51 66" />
          <circle className="tiny-mooncake" cx="157" cy="59" r="14" fill="url(#treeGlow)" />
          <path className="tiny-mooncake-line" d="M148 59h18M157 50v18" />
        </svg>
        <figcaption>Chú Cuội</figcaption>
      </figure>

      <figure className="festival-character hang-character">
        <svg viewBox="0 0 220 270" role="img">
          <defs>
            <linearGradient id="hangDress" x1="0" x2="1">
              <stop offset="0" stopColor="#ff8bb2" />
              <stop offset=".55" stopColor="#ffd4e3" />
              <stop offset="1" stopColor="#f06d9b" />
            </linearGradient>
            <linearGradient id="ribbonGold" x1="0" x2="1">
              <stop offset="0" stopColor="#f7c766" />
              <stop offset="1" stopColor="#fff0a8" />
            </linearGradient>
          </defs>
          <path className="character-shadow" d="M34 244c33-18 121-19 158 1-31 19-128 18-158-1Z" />
          <path className="silk-ribbon ribbon-a" d="M27 103c45 0 75 32 112 24 31-7 43-31 60-47-6 41-36 74-78 74-42 1-64-32-94-51Z" />
          <path className="silk-ribbon ribbon-b" d="M190 127c-36 0-61 24-91 17-28-7-43-28-62-44 5 39 31 70 69 70 35 0 57-24 84-43Z" />
          <path className="character-dress" fill="url(#hangDress)" d="M110 132c-34 13-54 51-61 108h122c-7-57-27-95-61-108Z" />
          <path className="dress-panel" d="M110 143c-13 25-21 55-22 92h45c-2-37-10-67-23-92Z" />
          <circle className="character-face" cx="110" cy="91" r="34" />
          <path className="hang-hair" d="M74 90c1-34 24-56 55-48 23 6 38 28 34 56-22-23-59-25-89-8Z" />
          <path className="hair-bun left" d="M77 70c-15-10-26 5-18 19 11-2 17-8 18-19Z" />
          <path className="hair-bun right" d="M143 67c16-8 26 9 16 21-11-3-16-10-16-21Z" />
          <circle className="character-eye" cx="98" cy="94" r="3.8" />
          <circle className="character-eye" cx="122" cy="94" r="3.8" />
          <path className="character-smile" d="M101 108c6 7 16 7 22 0" />
          <path className="sleeve-flow left" d="M68 154c-21 12-37 34-44 66 15 4 33-6 42-24 7-14 14-25 28-31Z" />
          <path className="sleeve-flow right" d="M152 154c23 11 38 34 45 66-16 4-34-6-43-24-7-14-15-25-28-31Z" />
          <path className="gold-sash" fill="url(#ribbonGold)" d="M76 152c25 17 47 17 69 0 3 10 2 19-3 27-20 13-45 13-65 0-5-8-6-17-1-27Z" />
          <path className="moon-wand" d="M157 66l30-26" />
          <circle className="wand-star" cx="190" cy="37" r="12" />
        </svg>
        <figcaption>Chị Hằng</figcaption>
      </figure>
    </div>
  );
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./renderer/src/pages/**/*.{js,ts,jsx,tsx}", "./renderer/src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // アニメーションのキーフレーム定義
      keyframes: {
        // ローディングスピンアニメーション
        loadingSpin: {
          "0%, 2%": { transform: "rotate(0deg)" },
          "12.5%, 14.5%": { transform: "rotate(90deg)" },
          "25%, 27%": { transform: "rotate(180deg)" },
          "37.5%, 39.5%": { transform: "rotate(270deg)" },
          "50%, 52%": { transform: "rotate(360deg)" },
          "62.5%, 64.5%": { transform: "rotate(450deg)" },
          "75%, 77%": { transform: "rotate(540deg)" },
          "87.5%, 89.5%": { transform: "rotate(630deg)" },
          "100%": { transform: "rotate(720deg)" },
        },
        // 奇数要素の点滅効果
        loadingEffectOdd: {
          "0%, 2%": { opacity: 0.3 },
          "12.5%, 14.5%": { opacity: 1 },
          "25%, 27%": { opacity: 0.3 },
          "37.5%, 39.5%": { opacity: 1 },
          "50%, 52%": { opacity: 0.3 },
          "62.5%, 64.5%": { opacity: 1 },
          "75%, 77%": { opacity: 0.3 },
          "87.5%, 89.5%": { opacity: 1 },
          "100%": { opacity: 0.3 },
        },
        // 偶数要素の点滅効果
        loadingEffectEven: {
          "0%, 2%": { opacity: 1 },
          "12.5%, 14.5%": { opacity: 0.3 },
          "25%, 27%": { opacity: 1 },
          "37.5%, 39.5%": { opacity: 0.3 },
          "50%, 52%": { opacity: 1 },
          "62.5%, 64.5%": { opacity: 0.3 },
          "75%, 77%": { opacity: 1 },
          "87.5%, 89.5%": { opacity: 0.3 },
          "100%": { opacity: 1 },
        },
      },
      // アニメーションの適用設定
      animation: {
        "loading-spin": "loadingSpin 9s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        "loading-effect-odd": "loadingEffectOdd 9s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        "loading-effect-even": "loadingEffectEven 9s cubic-bezier(0.65, 0, 0.35, 1) infinite",
      },
    },
  },
  plugins: [],
};

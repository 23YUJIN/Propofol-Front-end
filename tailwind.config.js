module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        rightbar: "#F9F8F9",
        develbg: "#EAEEFD",
        naver: "#1FC700",
        kakao: "#FFEB00",
        google: "#D93025",
        bg1: "#383430",
        bg2: "#908D8E",
        bg3: "#40382F",
        bg4: "#DCDCDC",
        bg5: "#666263",
        bg6: "#615e60",
        bg7: "#FBEAE0",
        bg8: "#DEDFDA",
        bg9: "#F07787",
        bg10: "#BE4555",
        date: "#5755C3",
        scroll: "#A2B0C0",
        sscroll: "#49596B",
        bbg: "#E8E3E1",
        bluepurple: "#8F8BD9",
      },
      gridTemplateRows: {
        80: "80px",
        100: "100px",
        7: "repeat(7, 15px)",
      },
      gridTemplateColumns: {
        54: "repeat(54, minmax(0, 1fr))",
      },
      transitionDelay: {
        2000: "2000ms",
      },
      spacing: {
        0.25: "0.0625rem",
        "1/10": "10%",
        "12/100": "12%",
        "15/100": "15%",
        "2/10": "20%",
        "27/100": "27%",
        "28.5/100": "28.5%",
        "3/10": "30%",
        "32.5/100": "32.5%",
        "4/10": "40%",
        "5/10": "50%",
        "55/100": "55%",
        "57.5/100": "57.5%",
        "6/10": "60%",
        "62.5/100": "62.5%",
        "65/100": "65%",
        "7/10": "70%",
        "8/10": "80%",
        "9/10": "90%",
      },
      screens: {
        "3xl": "1600px",
      },
      fontFamily: {
        test: ["pretend-medium"],
        btest: ["pretend-bold"],
        ebtest: ["pretend-EBold"],
        eltest: ["pretend-ELight"],
        ltest: ["pretend-light"],
        rtest: ["pretend-Reg"],
        sbtest: ["pretend-SBold"],
        ttest: ["pretend-Thin"],
        quiche: ["quiche-Sans"],
        confont1: ["consoleFont"],
        confont2: ["consoleFont2"],
        rumpi: ["rumpi"],
        iroBatang: ["iroBatang"],
        dolce: ["dolce"],
        timeless: ["timeless"],
        timelessB: ["timelessB"],
        good_brush: ["good_brush"],
        ba: ["bodo_amat"],
      },
      fontWeight: {
        ssbold: 500,
      },
      backgroundImage: {
        universe: "url('/public/img/universe.jpg')",
      },

      inset: {
        "9/10": "90%",
        "3/10": "30%",
        "4/10": "40%",
        "55/100": "55%",
        "6/10": "60%",
      },

      width: {
        0.25: "0.0625rem",
      },

      fontSize: {
        xxs: ".55rem",
        xs: ".75rem",
        tinysm: ".825rem",
        tiny: ".875rem",
        baselg: "1.075rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "4rem",
        "7xl": "5rem",
      },
      borderRadius: {
        large: "0.625rem",
      },

      height: {
        0.25: "0.0625rem",
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  },
  variants: {
    extend: {
      overflow: ["hover", "focus"],
      opacity: ["disabled"],
    },
  },
};

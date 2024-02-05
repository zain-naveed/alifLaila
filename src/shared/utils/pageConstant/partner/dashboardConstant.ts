const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      display: false,
    },
    title: {
      display: false,
      text: "",
    },

    tooltip: {
      displayColors: false,
      backgroundColor: "rgb(15, 17, 6,0.8)",
      padding: 14,
      footerFont: {
        weight: "normal",
      },
      footerColor: "white",
      bodyFont: {
        padding: 20,
        size: 15,
        weight: "bold",
      },
      callbacks: {
        title: () => {
          return "";
        },
        labelTextColor: (context: any) => {
          return "white";
        },
        label: (context: any) => {
          return context.formattedValue + " Sales";
        },
        footer: (context: any) => {
          return context[0].label;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        display: true,
      },
    },
    y: {
      ticks: {
        display: true,
      },
      grid: {
        display: false,
      },
    },
  },
};

const barChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      display: false,
    },
    title: {
      display: false,
      text: "",
    },

    tooltip: {
      displayColors: false,
      backgroundColor: "rgb(15, 17, 6,0.8)",
      padding: 14,
      footerFont: {
        weight: "normal",
      },
      footerColor: "white",
      bodyFont: {
        padding: 20,
        size: 15,
        weight: "bold",
      },
      callbacks: {
        title: () => {
          return "";
        },
        labelTextColor: (context: any) => {
          return "white";
        },
        label: (context: any) => {
          return context.formattedValue + " Sales";
        },
        footer: (context: any) => {
          return context[0].label;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        display: true,
      },
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        display: true,
      },
      grid: {
        display: true,
      },
    },
  },
};

const SortFilters: { label: string; value: string }[] = [
  {
    label: "Most Read",
    value: "most_read",
  },
  {
    label: "Most Popular",
    value: "most_popular",
  },
  {
    label: "Highly Rated",
    value: "highly_rated",
  },
];

export { SortFilters, barChartOptions, lineChartOptions };

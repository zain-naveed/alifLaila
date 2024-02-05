import {
  ChargeIcon,
  CrownIcon,
  HeroSlider1,
  HeroSlider2,
  WhyAsset1,
  WhyAsset2,
  WhyAsset3,
  WhyAsset4,
  WhyAsset6,
} from "assets";

const genreColors = [
  "#ef437b",
  "#9A469B",
  "#1897A6",
  "#9A469B",
  "#FDA504",
  "#58C0BF",
  "#9A469B",
  "#EF437B",
];

const HeroContent = [
  {
    slidePath: HeroSlider1,
    altText: "Slide father reading book with children Aliflaila app",
  },
  {
    slidePath: HeroSlider2,
    altText: "Aliflaila app Banner iamge",
  },
];

const plans: {
  heading: string;
  description: string;
  isAnnual: boolean;
  Icon: any;
  isEducator: boolean;
}[] = [
  {
    heading: "Individual Readers",
    description:
      "Sign up and read one free book per day. Want more? Get a membership and access premium books. Individual account available.",
    isAnnual: false,
    isEducator: false,
    Icon: null,
  },
  {
    heading: "Family Account",
    description:
      "Join as a family and add your children to your account. Enjoy reading together and discover books for all ages and interests.",
    isAnnual: true,
    isEducator: false,
    Icon: CrownIcon,
  },
  {
    heading: "Educators",
    description:
      "Join as an educator and teach at a school or on your own. Explore and assign books to your class to spark your student's imagination.",
    isAnnual: false,
    isEducator: true,
    Icon: ChargeIcon,
  },
];

const whyAlifLailaConstants: {
  title: string;
  content: string;
  color: string;
  bgColor: string;
  Asset: any;
}[] = [
  {
    title: "A digital wonderland",
    content:
      "Enter a magical world where you can read and learn from amazing stories in a safe and fun way.",
    color: "#1897A6",
    bgColor: "#E1FCFF",
    Asset: WhyAsset1,
  },
  {
    title: "Adventurous Illustrations",
    content:
      "Discover the magical world with captivating illustrations that nurture your imagination and unleash your creativity.",
    color: "#EF437B",
    bgColor: "#FFEBF1",
    Asset: WhyAsset2,
  },
  {
    title: "Personalized Bookshelves",
    content:
      "Spice up reading by curating your own bookshelves filled with stories that suit you.",
    color: "#C2D52E",
    bgColor: "#FDFFEB",
    Asset: WhyAsset3,
  },
  {
    title: "Quiz Time",
    content:
      "Put your skills to the test and sharpen your mind with questions and puzzles that follow each story.",
    color: "#9A469B",
    bgColor: "#FFEBFF",
    Asset: WhyAsset4,
  },
  {
    title: "Read More, Get Rewarded",
    content:
      "Read more stories, achieve badges, and ascend to higher levels as you conquer your reading challenges.",
    color: "#1897A6",
    bgColor: "#E1FCFF",
    Asset: WhyAsset4,
  },
  {
    title: "Stay In The Loop",
    content:
      "Get the lowdown on books read, time spent, points earned, and more - All on your Dashboard",
    color: "#EF437B",
    bgColor: "#FFEBF1",
    Asset: WhyAsset6,
  },
];

interface tabProps {
  eventKey: string;
  title: string;
  pointers: any;
}

const tabsConstant: tabProps[] = [
  {
    eventKey: "Publisher",
    title: "Publisher",
    pointers: [
      {
        title: "Expand Readership",
        description:
          "AlifLaila offers a platform to connect with a broader audience, increasing visibility and readership for publishers.",
      },
      {
        title: "Global Reach",
        description:
          "AlifLaila opens the door to an international audience, allowing your content to transcend borders & reach readers worldwide.",
      },
      {
        title: "Publish Like a Pro",
        description:
          "Our user-friendly platform empowers publisher to showcase their catalogue with a smooth and refined approach.",
      },
      {
        title: "Personalized Profile Page",
        description:
          "AlifLaila empowers publishers with a personalized profile page for showcasing their profiles & catalogues- all in one place.",
      },
      {
        title: "Minimum Platform Fee",
        description:
          "No upfront fee; publishers pay the minimum platform fee once they earn from their books online.",
      },
      {
        title: "Cost Efficiency",
        description:
          "Save significantly on printing costs by embracing digital publishing on AlifLaila, making your catalogue accessible to the audience without traditional printing overhead.",
      },
      {
        title: "Insightful Analytics",
        description:
          "Gain valuable insights into the performance of your books with our comprehensive analytical tools, enabling data-driven decisions to enhance your publishing strategy.",
      },
      {
        title: "Printed Copy Delivering Service",
        description:
          "At AlifLaila, publishers can offer print copies of their books for users to order. Publishers have pricing control, while AlifLaila manages order fulfilment.",
      },
    ],
  },
  {
    eventKey: "Author",
    title: "Author",
    pointers: [
      {
        title: "Reach More Readers",
        description:
          "AlifLaila helps you connect with a larger audience, boosting your visibility and readership for your creations.",
      },
      {
        title: "Global Reach",
        description:
          "AlifLaila opens the door to an international audience, allowing your content to transcend borders and reach readers worldwide.",
      },
      {
        title: "Digital Publishing Made Easy",
        description:
          "Our user-friendly platform empowers authors to publish their work with the refinement and precision befitting the digital age.",
      },
      {
        title: "Elevating Royalties",
        description:
          "AlifLaila pays authors handsomely for their work, surpassing the market standards and recognizing their creative worth in the digital age.",
      },
      {
        title: "Make Your Book More Visual",
        description:
          "At AlifLaila, we empower authors to enhance their books with illustrations and provide flexible compensation options, including a one-time upfront payment or a percentage of their earnings.",
      },
      {
        title: "Personalized Profile Page",
        description:
          "AlifLaila empowers publishers with a personalized profile page for showcasing their profiles and catalogues- all in one place.",
      },
      {
        title: "Marketing Support",
        description:
          "AlifLaila offers marketing and promotional assistance to help authors effectively promote their works and build a dedicated readership.",
      },
      {
        title: "Copyright Protection",
        description:
          "Our platform prioritizes copyright protection, safeguarding your intellectual property and ensuring fair compensation for your creations.",
      },
    ],
  },
];

export { plans, whyAlifLailaConstants, genreColors, tabsConstant, HeroContent };

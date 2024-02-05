import {
  Check3Icon,
  SchoolLanding1,
  SchoolLanding2,
  SchoolLanding3,
  SchoolLanding4,
  SchoolLanding5,
  SchoolLanding6,
} from "assets";

const StaticInfo: {
  Icon: any;
  title: string;
  content: string;
  color: string;
}[] = [
  {
    Icon: SchoolLanding1,
    title: "Support Digital Literacy",
    content:
      "AlifLaila encourages a love for literature and familiarizes students with the digital world. This prepares them for the challenges and opportunities of the modern age.",
    color: "#FDA504",
  },
  {
    Icon: SchoolLanding2,
    title: "Facilitate Collaboration Learning",
    content:
      "Educators can easily group students together based on shared interests and passions, promoting collaborative learning experiences that ignite creativity and teamwork.",
    color: "#FDA504",
  },
  {
    Icon: SchoolLanding3,
    title: "Customized Learning Process",
    content:
      "AlifLaila empowers educators to create personalized classrooms, fostering an engaging tailored learning experience that caters to the unique needs and interests of each student.",
    color: "#FDA504",
  },
  {
    Icon: SchoolLanding4,
    title: "Teacher-Student Connection",
    content:
      "AlifLaila strengthens the bond between teachers and students by providing a secure platform for communication and engagement. Teachers can inspire and guide their students effectively through this digital connection.",
    color: "#FDA504",
  },
  {
    Icon: SchoolLanding5,
    title: "Inspiring Independent Reading",
    content:
      "Our platform recommends diverse books suitable for all ages, matching them with students’ interests. Teachers can effortlessly assign these books to multiple students simultaneously, helping them to understand how the world works.",
    color: "#FDA504",
  },
  {
    Icon: SchoolLanding6,
    title: "Effortless Student Activity Monitoring",
    content:
      "AlifLaila provides educators with intuitive tools to closely track and analyze student activity, allowing them to better understand individual progress and identify opportunities for growth.",
    color: "#FDA504",
  },
];

const ContentData: {
  paragraph: string;
  Icon: any;
}[] = [
  {
    Icon: Check3Icon,
    paragraph:
      "AlifLaila provides educators with intuitive tools to closely track and analyze student activity, allowing them to better understand individual progress and identify opportunities for growth.",
  },
  {
    Icon: Check3Icon,
    paragraph:
      "AlifLaila empowers educators to create personalized classrooms, fostering an engaging tailored learning experience that caters to the unique needs and interests of each student.",
  },
  {
    Icon: Check3Icon,
    paragraph:
      "Educators can easily group students together based on shared interests and passions, promoting collaborative learning experiences that ignite creativity and teamwork.",
  },
  {
    Icon: Check3Icon,
    paragraph:
      "AlifLaila empowers educators to seamlessly monitor students' progress. With a single click, educators can easily access information about students' current levels, track the status of book completion, and review quiz scores.",
  },
];

export { ContentData, StaticInfo };

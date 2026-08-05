import CircularGallery, { type TimelineItem } from "../../components/CircularGallery";
import Header from "../../components/Header/Header";

import bornImage from "../../assets/Photo/Timeline/1_born.jpg";
import preSchoolGuitar from "../../assets/Photo/Timeline/3_anaokul.JPG";
import firstSchool from "../../assets/Photo/Timeline/4_ilkokul.jpg";
import computerPhoto from "../../assets/Photo/Timeline/5_computer.JPG";
import kayseriPhoto from "../../assets/Photo/Timeline/6_kayseri.JPG";
import muncubePhoto from "../../assets/Photo/Timeline/7_muncube.JPG";
import guzelbahcePhoto from "../../assets/Photo/Timeline/8_guzelbahce.jpg";
import hairPhoto from "../../assets/Photo/Timeline/9_hair.jpg";
import graduationPhoto from "../../assets/Photo/Timeline/10_mezun.JPG";

const timelineItems: TimelineItem[] = [
  {
    year: "2003",
    title: "The beginning",
    description: "The first frame of my story — where curiosity, imagination and everything that followed began.",
    image: bornImage,
  },
  {
    year: "2007",
    title: "First memories",
    description: "Early school years, new friendships and the first moments of discovering the world beyond home.",
    image: preSchoolGuitar,
  },
  {
    year: "2008",
    title: "School begins",
    description: "A new classroom, a new rhythm and the beginning of a long journey built around learning.",
    image: firstSchool,
  },
  {
    year: "2009",
    title: "Meeting computers",
    description: "Technology became more than a screen; it turned into a place to explore, question and create.",
    image: computerPhoto,
  },
  {
    year: "2015",
    title: "Kayseri",
    description: "New places and experiences widened my perspective and added another chapter to the story.",
    image: kayseriPhoto,
  },
  {
    year: "2015",
    title: "MUNCube",
    description: "A memorable experience shaped by collaboration, communication and sharing ideas with others.",
    image: muncubePhoto,
  },
  {
    year: "2016",
    title: "Güzelbahçe",
    description: "A fresh environment, lasting friendships and years that quietly shaped who I would become.",
    image: guzelbahcePhoto,
  },
  {
    year: "2019",
    title: "A new chapter",
    description: "Change became visible — not only in appearance, but also in perspective, interests and goals.",
    image: hairPhoto,
  },
  {
    year: "2021",
    title: "Graduation",
    description: "One chapter closed and another opened, carrying every memory, lesson and friendship forward.",
    image: graduationPhoto,
  },
];

const About = () => {
  return (
    <div className="relative isolate flex h-dvh flex-col overflow-hidden bg-black text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:20px_20px] opacity-10"
      />
      <Header />
      <main className="relative min-h-0 flex-1">
        <CircularGallery items={timelineItems} />
      </main>
    </div>
  );
};

export default About;

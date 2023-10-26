import Image from "next/image";
// import { FaMusic } from "react-icons/fa";
import AllEvents from "../../assets/img/svg/icons-set/all-events.svg";
import BestDadIcon from "../../assets/img/svg/icons-set/fathers-day.svg";
import BallonIcon from "../../assets/img/svg/icons-set/mothers-day.svg"
import ValentineIcon from "../../assets/img/svg/icons-set/valentines.svg"
import BirthdayIcon from "../../assets/img/svg/icons-set/birthday.svg"
import ChristmasIcon from "../../assets/img/svg/icons-set/christmas.svg"
import EasterIcon from "../../assets/img/svg/icons-set/easter.svg"
import FarewellIcon from "../../assets/img/svg/icons-set/farewell.svg"
import MusicIcon from "../../assets/img/svg/icons-set/music.svg"
import GoodVibesIcon from "../../assets/img/svg/icons-set/good-vibes.svg"
import ForHerIcon from "../../assets/img/svg/icons-set/for-her.svg"
import PromIcon from "../../assets/img/svg/icons-set/prom.svg"
import DatingIcon from "../../assets/img/svg/icons-set/prom.svg"
import WeddingIcon from "../../assets/img/svg/icons-set/wedding.svg"

export const categoriesOptions = [
  {
    id: "all",
    title: "All events",
    icon: <Image src={AllEvents} alt="All events" width="16" height="16" />,
  },
  {
    id: "fathers-day",
    title: "Father's Day",
    icon: <Image src={BestDadIcon} alt="Father's Day" width="16" height="16" />,
  },
  {
    id: "mothers-day",
    title: "Mother's Day",
    icon: <Image src={BallonIcon} alt="Mother's Day" width="16" height="16" />,
  },
  {
    id: "valentines",
    title: "Valentines",
    icon: <Image src={ValentineIcon} alt="Valentines" width="16" height="16" />,
  },
  {
    id: "birthday",
    title: "Birthday",
    icon: <Image src={BirthdayIcon} alt="Birthday" width="16" height="16" />,
  },
  {
    id: "christmas",
    title: "Christmas",
    icon: (
      <Image src={ChristmasIcon} alt="Christmas" width="16" height="16" />
    ),
  },
  {
    id: "easter",
    title: "Easter",
    icon: <Image src={EasterIcon} alt="Easter" width="16" height="16" />,
  },
  {
    id: "farewell",
    title: "Farewell",
    icon: <Image src={FarewellIcon} alt="Farewell" width="16" height="16" />,
  },
  {
    id: "music",
    title: "Music",
    icon: <Image src={MusicIcon} alt="Music" width="16" height="16" />,
  },
  // {
  //   id: "good-vibes",
  //   title: "Good Vibes",
  //   icon: <Image src={GoodVibesIcon} alt="Good Vibes" width="16" height="16" />,
  // },
  // {
  //   id: "for-her",
  //   title: "For Her",
  //   icon: <Image src={ForHerIcon} alt="For Her" width="16" height="16" />,
  // },
  // {
  //   id: "prom",
  //   title: "Prom",
  //   icon: <Image src={PromIcon} alt="Prom" width="16" height="16" />,
  // },
  // {
  //   id: "prom-dating",
  //   title: "Prom Dating",
  //   icon: <Image src={DatingIcon} alt="Prom Dating" width="16" height="16" />,
  // },
  // {
  //   id: "wedding",
  //   title: "Wedding",
  //   icon: <Image src={WeddingIcon} alt="Wedding" width="16" height="16" />,
  // },
  // {
  //   id: "music",
  //   title: "Music",
  //   icon: <FaMusic height="16" width="16" />,
  // },
  {
    id: "good-vibes",
    title: "Good Vibes",
    icon: <Image src={GoodVibesIcon} alt="farewell" width="16" height="16" />,
  },
  {
    id: "for-her",
    title: "For Her",
    icon: <Image src={ForHerIcon} alt="farewell" width="16" height="16" />,
  },
  {
    id: "prom",
    title: "Prom",
    icon: <Image src={PromIcon} alt="farewell" width="16" height="16" />,
  },
  {
    id: "prom-dating",
    title: "Prom Dating",
    icon: <Image src={DatingIcon} alt="farewell" width="16" height="16" />,
  },
  {
    id: "wedding",
    title: "Wedding",
    icon: <Image src={WeddingIcon} alt="farewell" width="16" height="16" />,
  },
];
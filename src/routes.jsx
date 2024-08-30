import {
  HomeIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  PlayCircleIcon,
  TicketIcon,
  NewspaperIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Stories from "@/pages/dashboard/stories";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        id: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <CurrencyDollarIcon {...icon} />,
        name: "Платежи",
        id: "Платежи",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <PlayCircleIcon {...icon} />,
        name: "Истории",
        id: "Истории",
        path: "/stories",
        element: <Stories />,
      },
      {
        icon: <TicketIcon {...icon} />,
        name: "Тарифы",
        id: "Тарифы",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <NewspaperIcon {...icon} />,
        name: "Заявки",
        id: "Заявки",
        path: "/notifications",
        element: <Notifications />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        id: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        id: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        id: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Accardion",
        children:[
          {
            icon: <TableCellsIcon {...icon} />,
            id: "tables",
            name: "tables",
            path: "/tables",
            element: <Tables />,
          },
          {
            icon: <InformationCircleIcon {...icon} />,
            name: "notifications",
            id: "notifications",
            path: "/notifications",
            element: <Notifications />,
          },
        ],
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;

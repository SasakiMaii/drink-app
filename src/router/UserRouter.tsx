import PollResultFiltering from "../components/pages/PollResultFiltering";
import Contact from "../components/pages/Contact";
import Faq from "../components/pages/Faq";
import Guide from "../components/pages/Guide";
import ItemDetail from "../components/pages/ItemDetail";
import ItemSearch from "../components/pages/ItemSearch";
import Poll from "../components/pages/Poll";
import PollResult from "../components/pages/PollResult";
import Timeline from "../components/pages/Timeline";
import NotFound from "../components/pages/NotFound";

export const UserRouter = [
  { path: "/timeline", element: <Timeline /> },
  { path: "/search", element: <ItemSearch /> },
  { path: "/search/:id", element: <ItemDetail /> },
  { path: "/guide", element: <Guide /> },
  { path: "/poll", element: <Poll /> },
  { path: "/poll/:id", element: <PollResult /> },
  { path: "/poll/pollresult", element: <PollResultFiltering /> },
  { path: "/home/*", element: <NotFound /> },
];

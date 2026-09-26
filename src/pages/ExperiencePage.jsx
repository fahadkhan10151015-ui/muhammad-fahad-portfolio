import { useParams } from "react-router-dom";
import DetailPage from "../components/DetailPage.jsx";
import NotFound from "./NotFound.jsx";
import { experience } from "../data/portfolio.js";

export default function ExperiencePage() {
  const { slug } = useParams();
  const job = experience.find((e) => e.slug === slug);
  if (!job) return <NotFound />;
  return <DetailPage kind="experience" entry={job} />;
}

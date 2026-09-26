import { useParams } from "react-router-dom";
import DetailPage from "../components/DetailPage.jsx";
import NotFound from "./NotFound.jsx";
import { skillPages } from "../data/portfolio.js";

export default function SkillPage() {
  const { slug } = useParams();
  const skill = skillPages.find((s) => s.slug === slug);
  if (!skill) return <NotFound />;
  return <DetailPage kind="skill" entry={skill} />;
}


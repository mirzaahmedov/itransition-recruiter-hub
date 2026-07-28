import { useCategoryStore } from "@/store/use-category-store";
import type { ResumeAttributeItem, ResumeDetail } from "./api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotePencilIcon, PencilSimpleLineIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { styles } from "./styles";
import type { ReactNode } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ResumeStatus } from "@rh/database/browser";
import { Can } from "@casl/react";
import { isDynamicValueEmpty } from "@rh/shared/utils";

function ResumeSection({ title, items }: { title: string; items: ResumeAttributeItem[] }) {
  return (
    <section className="resume-section">
      <h2 className="resume-section-title">{title}</h2>
      <dl className="resume-attribute-list">
        {items.map((ra) => (
          <div key={ra.id} className="resume-attribute-row">
            <dt className="resume-attribute-name">{ra.positionAttribute.attribute.name}</dt>
            <dd className="resume-attribute-value">{formatValue(ra)}</dd>
            <div className="resume-attribute-meta">
              {isDynamicValueEmpty(ra.userAttribute) && (
                <Badge variant="warning">
                  <WarningCircleIcon /> Not provided
                </Badge>
              )}
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}

export const ResumeView = ({ resume, onEdit }: { resume: ResumeDetail; onEdit: VoidFunction }) => {
  const categories = useCategoryStore((store) => store.categories);

  const groupedByCategory = resume.attributes.reduce(
    (acc, ra) => {
      const categoryId = ra.positionAttribute.attribute.categoryId;
      if (!acc[categoryId]) acc[categoryId] = [];
      acc[categoryId].push(ra);
      return acc;
    },
    {} as Record<string, ResumeAttributeItem[]>,
  );

  const sortedCategories = categories.filter((cat) => groupedByCategory[cat.id]).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <div className="resume-page">
        <header className="resume-header">
          <div className="resume-header-info">
            <Avatar className="resume-avatar">
              <AvatarImage src={resume.user.avatar ?? undefined} alt={resume.user.name ?? "Avatar"} />
              <AvatarFallback>{(resume.user.name ?? "U").charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="resume-name">{resume.user.name ?? "Unnamed"}</h1>
                {resume.status === ResumeStatus.DRAFT ? (
                  <Badge variant="warning">
                    <NotePencilIcon /> Draft
                  </Badge>
                ) : null}
              </div>
              <p className="resume-email">{resume.user.email}</p>
            </div>
          </div>
          <div className="resume-position">
            <p className="resume-position-label">Applying for</p>
            <Link to={`/positions/${resume.position.id}`} className="resume-position-title">
              {resume.position.title}
            </Link>
            <div className="no-print mt-5">
              <Can I="update" a="Resume">
                <Button variant="link" onClick={onEdit}>
                  <PencilSimpleLineIcon />
                  Edit
                </Button>
              </Can>
            </div>
          </div>
        </header>

        <div className="resume-body">
          {sortedCategories.map((category) => {
            const items = groupedByCategory[category.id];
            if (!items || items.length === 0) return null;
            return <ResumeSection key={category.id} title={category.name} items={items} />;
          })}
        </div>
      </div>
      <style>{styles}</style>
    </>
  );
};

function formatValue(ra: ResumeAttributeItem): ReactNode {
  const { userAttribute } = ra;
  switch (userAttribute.attribute.type) {
    case "TEXT":
      return userAttribute.textValue ?? "—";
    case "MARKDOWN":
      return <Markdown rehypePlugins={[rehypeRaw]}>{userAttribute.textValue}</Markdown>;
    case "NUMERIC":
      return userAttribute.numberValue != null ? String(userAttribute.numberValue) : "—";
    case "BOOLEAN":
      return userAttribute.booleanValue != null ? (userAttribute.booleanValue ? "Yes" : "No") : "—";
    case "DATE":
      return userAttribute.dateValue ? format(new Date(userAttribute.dateValue), "PPP") : "—";
    case "DATEPERIOD":
      if (userAttribute.startDateValue && userAttribute.endDateValue) {
        return `${format(new Date(userAttribute.startDateValue), "PPP")} — ${format(new Date(userAttribute.endDateValue), "PPP")}`;
      }
      return "—";
    case "CHOICE":
      return userAttribute.choice?.value ?? "—";
    case "IMAGE":
      return userAttribute.textValue ?? "—";
    default:
      return "—";
  }
}

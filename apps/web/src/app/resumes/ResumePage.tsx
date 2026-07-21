import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchResume } from "./api";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeftIcon, PrinterIcon } from "@phosphor-icons/react";
import { useCategoryStore } from "@/store/useCategoryStore";
import type { ResumeAttributeItem, ResumeDetail } from "./api";

function formatValue(ra: ResumeAttributeItem): string {
  const { userAttribute } = ra;
  switch (userAttribute.attribute.type) {
    case "TEXT":
    case "MARKDOWN":
      return userAttribute.textValue ?? "—";
    case "NUMERIC":
      return userAttribute.numberValue != null ? String(userAttribute.numberValue) : "—";
    case "BOOLEAN":
      return userAttribute.booleanValue != null ? (userAttribute.booleanValue ? "Yes" : "No") : "—";
    case "DATE":
      return userAttribute.dateValue ? new Date(userAttribute.dateValue).toLocaleDateString() : "—";
    case "DATEPERIOD":
      if (userAttribute.startDateValue && userAttribute.endDateValue) {
        return `${new Date(userAttribute.startDateValue).toLocaleDateString()} — ${new Date(userAttribute.endDateValue).toLocaleDateString()}`;
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

function ResumeSection({ title, items }: { title: string; items: ResumeAttributeItem[] }) {
  return (
    <section className="resume-section">
      <h2 className="resume-section-title">{title}</h2>
      <dl className="resume-attribute-list">
        {items.map((ra) => (
          <div key={ra.id} className="resume-attribute-row">
            <dt className="resume-attribute-name">{ra.positionAttribute.attribute.name}</dt>
            <dd className="resume-attribute-value">{formatValue(ra)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const ResumeView = ({ resume }: { resume: ResumeDetail }) => {
  const categories = useCategoryStore((store) => store.categories);

  const groupedByCategory = resume.resumeAttributes.reduce(
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
    <div className="resume-page">
      <header className="resume-header">
        <div className="resume-header-info">
          <Avatar className="resume-avatar">
            <AvatarImage src={resume.user.avatar ?? undefined} alt={resume.user.name ?? "Avatar"} />
            <AvatarFallback>{(resume.user.name ?? "U").charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="resume-name">{resume.user.name ?? "Unnamed"}</h1>
            <p className="resume-email">{resume.user.email}</p>
          </div>
        </div>
        <div className="resume-position">
          <p className="resume-position-label">Applying for</p>
          <Link to={`/positions/${resume.position.id}`} className="resume-position-title">
            {resume.position.title}
          </Link>
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
  );
};

const ResumePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: resume, isFetching } = useQuery({
    queryKey: ["resumes", id],
    queryFn: () => fetchResume(id!),
    enabled: !!id,
  });

  const resumeData = resume?.data;

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center py-20">
          <p className="text-muted-foreground">Resume not found.</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate("/resumes")}>
            Back to resumes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="no-print flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/resumes")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back to resumes
        </button>
        <div className="flex items-center gap-2">
          <Badge variant={resumeData.status === "PUBLISHED" ? "success" : "warning"}>{resumeData.status}</Badge>
          <Button variant="outline" onClick={() => window.print()}>
            <PrinterIcon />
            Print
          </Button>
        </div>
      </div>

      <div className="resume-container rounded-2xl border bg-card shadow-sm">
        <ResumeView resume={resumeData} />
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .resume-container {
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
          }
          .resume-page { padding: 0 !important; }
        }

        .resume-page {
          padding: 2rem;
        }

        .resume-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid var(--color-border, hsl(240 5.9% 90%));
        }

        .resume-header-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .resume-avatar {
          width: 4rem;
          height: 4rem;
          flex-shrink: 0;
        }

        .resume-name {
          font-size: 1.75rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .resume-email {
          font-size: 0.875rem;
          color: hsl(240 3.8% 46.1%);
          margin-top: 0.25rem;
        }

        .resume-position {
          text-align: right;
          flex-shrink: 0;
        }

        .resume-position-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(240 3.8% 46.1%);
        }

        .resume-position-title {
          font-size: 1rem;
          font-weight: 600;
          margin-top: 0.125rem;
          text-decoration: underline;
          color: var(--color-brand);
        }

        .resume-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-top: 1.5rem;
        }

        .resume-section-title {
          font-size: 0.8125rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(240 3.8% 46.1%);
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--color-border, hsl(240 5.9% 90%));
          margin-bottom: 0.75rem;
        }

        .resume-attribute-list {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .resume-attribute-row {
          display: grid;
          grid-template-columns: 10rem 1fr;
          gap: 1rem;
          align-items: baseline;
        }

        .resume-attribute-name {
          font-size: 0.8125rem;
          font-weight: 500;
          color: hsl(240 3.8% 46.1%);
        }

        .resume-attribute-value {
          font-size: 0.875rem;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }

        @media (max-width: 640px) {
          .resume-header {
            flex-direction: column;
          }
          .resume-position {
            text-align: left;
          }
          .resume-attribute-row {
            grid-template-columns: 1fr;
            gap: 0.125rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePage;

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PositionStatus } from "@rh/database/browser";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  FilesIcon,
  UsersThreeIcon,
  ReadCvLogoIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Resumes Created", value: 1_284, icon: FilesIcon },
  { label: "Open Positions", value: 56, icon: BriefcaseIcon },
  { label: "Candidates Registered", value: 3_421, icon: UsersThreeIcon },
];

const latestPositions = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    description:
      "We are looking for an experienced frontend engineer to lead the development of our next-generation web application using React and TypeScript.",
    status: PositionStatus.ACTIVE,
    attributes: 5,
    createdAt: "2026-07-20",
  },
  {
    id: "2",
    title: "Backend Developer",
    description:
      "Join our backend team to design and implement scalable APIs and microservices with NestJS and PostgreSQL.",
    status: PositionStatus.ACTIVE,
    attributes: 4,
    createdAt: "2026-07-18",
  },
  {
    id: "3",
    title: "DevOps Engineer",
    description:
      "Help us build and maintain CI/CD pipelines, manage cloud infrastructure, and improve system reliability across all environments.",
    status: PositionStatus.ACTIVE,
    attributes: 3,
    createdAt: "2026-07-15",
  },
  {
    id: "4",
    title: "UI/UX Designer",
    description:
      "Create intuitive and visually compelling user experiences. Work closely with product and engineering teams to bring designs to life.",
    status: PositionStatus.ACTIVE,
    attributes: 6,
    createdAt: "2026-07-12",
  },
  {
    id: "5",
    title: "QA Automation Engineer",
    description:
      "Develop and maintain automated test suites to ensure the quality and reliability of our platform across all browsers and devices.",
    status: PositionStatus.ARCHIVED,
    attributes: 3,
    createdAt: "2026-07-10",
  },
  {
    id: "6",
    title: "Product Manager",
    description:
      "Drive product strategy and roadmap. Collaborate with cross-functional teams to deliver features that delight our users.",
    status: PositionStatus.ACTIVE,
    attributes: 4,
    createdAt: "2026-07-08",
  },
];

const PositionCard = ({
  position,
}: {
  position: (typeof latestPositions)[number];
}) => (
  <Link
    to={`/positions/${position.id}`}
    className="group block rounded-2xl border bg-card p-5 transition-all hover:shadow-md hover:border-foreground/15"
  >
    <div className="flex items-start justify-between gap-3">
      <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors">
        {position.title}
      </h3>
      <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-brand transition-colors mt-0.5" />
    </div>
    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
      {position.description}
    </p>
    <div className="mt-4 flex items-center gap-1">
      <Badge variant="info">
        {position.attributes}{" "}
        {position.attributes === 1 ? "attribute" : "attributes"}
      </Badge>
      {position.status === PositionStatus.ARCHIVED ? (
        <Badge variant="secondary">Archived</Badge>
      ) : null}
    </div>
  </Link>
);

const HomePage = () => (
  <div className="min-h-full">
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/home" className="flex items-center gap-2">
          <span className="size-8 shrink-0 bg-brand text-white rounded-xl grid place-items-center">
            <ReadCvLogoIcon className="icon" />
          </span>
          <span className="font-bold text-sm">RecruiterHub</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" render={<Link to="/auth/login" />}>
            Sign in
          </Button>
          <Button size="sm" render={<Link to="/auth/register" />}>
            Get started
          </Button>
        </div>
      </div>
    </header>

    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-16 text-center">
        <Badge variant="info" size="lg" className="mb-6">
          Hiring made simple
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Find the right people
          <br />
          for every role
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          RecruiterHub helps you manage positions, collect resumes, and connect
          with candidates — all in one place.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button size="lg" render={<Link to="/auth/register" />}>
            Create an account
          </Button>
          <Button
            variant="outline"
            size="lg"
            render={<Link to="/auth/login" />}
          >
            Sign in
          </Button>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border bg-card p-6"
          >
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
              <Icon className="icon-md" />
            </div>
            <div>
              <p className="text-2xl font-bold">{value.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Latest Positions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            See what roles are open right now
          </p>
        </div>
        <Button variant="ghost" size="sm" render={<Link to="/positions" />}>
          View all <ArrowRightIcon className="icon" />
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {latestPositions.map((position) => (
          <PositionCard key={position.id} position={position} />
        ))}
      </div>
    </section>

    <footer className="border-t">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <span className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} RecruiterHub. All rights reserved.
        </span>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link to="/positions" className="hover:text-foreground transition-colors">
            Positions
          </Link>
          <Link to="/auth/login" className="hover:text-foreground transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  </div>
);

export default HomePage;

import { Badge, OutlineBadge } from "@/components/ui/Badge";
import LinkButton from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import { ALL_JOBS, categoryColors } from "@/lib/jobs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LatestJobs = () => {
  const latest = [...ALL_JOBS]
    .sort((a, b) => a.posted_days_ago - b.posted_days_ago)
    .slice(0, 8);
  return (
    <section className="w-full pt-18 pb-20 bg-light-gray">
      <div className="container">
        <div className="flex flex-col gap-12">
          <div className="flex items-end gap-10 justify-between">
            <Text variant={"h2"} fontFamily={"clash"}>
              Latest <span className="text-accent-blue">jobs</span>
            </Text>
            <LinkButton href="/jobs">Show all jobs</LinkButton>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-4 gap-x-8">
            {latest.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                className="group block"
              >
                <div className="bg-white px-6 py-5 flex items-start gap-5 border border-border hover:border-primary hover:shadow-sm transition-all">
                  <div className="w-12 h-12 border border-border flex items-center justify-center bg-light-gray shrink-0 overflow-hidden">
                    <Image
                      src={job.company_logo}
                      alt={job.company_name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <Text
                      variant={"body_lg"}
                      className="font-semibold text-neutral-100 group-hover:text-primary transition-colors truncate"
                    >
                      {job.job_title}
                    </Text>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Text variant={"body_sm"} className="text-neutral-60">
                        {job.company_name}
                      </Text>
                      <div className="h-1 w-1 rounded-full bg-neutral-80"></div>
                      <Text variant={"body_sm"} className="text-neutral-60">
                        {job.location}
                      </Text>
                      <div className="h-1 w-1 rounded-full bg-neutral-80"></div>
                      <Text variant={"body_sm"} className="text-neutral-60">
                        {job.posted_days_ago === 0
                          ? "Today"
                          : `${job.posted_days_ago}d ago`}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        label={job.jobType}
                        color={job.is_remote ? "#26A4FF" : "#4640DE"}
                      />
                      <div className="h-[28px] w-px bg-neutral-20"></div>
                      {job.category.slice(0, 2).map((category) => (
                        <OutlineBadge
                          key={category}
                          label={category}
                          color={categoryColors[category] || "#4640DE"}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right hidden sm:block">
                    <Text
                      variant="body_sm"
                      className="text-neutral-60 font-semibold"
                    >
                      ${(job.salary_min / 1000).toFixed(0)}k–$
                      {(job.salary_max / 1000).toFixed(0)}k
                    </Text>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;

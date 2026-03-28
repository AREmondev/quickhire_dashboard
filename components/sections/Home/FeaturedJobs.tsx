import JobCard from "@/components/features/JobCard";
import { Badge } from "@/components/ui/Badge";
import LinkButton from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import { ALL_JOBS, categoryColors } from "@/lib/jobs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const FeaturedJobs = () => {
  const featured = ALL_JOBS.filter((j) => j.is_featured);
  return (
    <section className="w-full py-18">
      <div className="container">
        <div className="flex flex-col gap-12">
          <div className="flex items-end gap-10 justify-between">
            <Text variant={"h2"} fontFamily={"clash"}>
              Featured <span className="text-accent-blue">jobs</span>
            </Text>
            <LinkButton href="/jobs">Show all jobs</LinkButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((job) => (
              <JobCard job={job} key={job.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;

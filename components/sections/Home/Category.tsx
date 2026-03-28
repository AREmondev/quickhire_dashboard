import LinkButton from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import React from "react";
import { BsLaptop } from "react-icons/bs";
import { FaBusinessTime } from "react-icons/fa";
import type { IconType } from "react-icons";
import { FcSalesPerformance } from "react-icons/fc";
import { HiOutlineUserGroup } from "react-icons/hi";
import {
  MdOutlineAttachMoney,
  MdOutlineCampaign,
  MdOutlineDesignServices,
  MdOutlineEngineering,
} from "react-icons/md";
export const jobCategories: {
  category: string;
  jobs: number;
  icon: IconType;
}[] = [
  {
    category: "Design",
    jobs: 235,
    icon: MdOutlineDesignServices,
  },
  {
    category: "Sales",
    jobs: 756,
    icon: FcSalesPerformance,
  },
  {
    category: "Marketing",
    jobs: 140,
    icon: MdOutlineCampaign,
  },
  {
    category: "Finance",
    jobs: 325,
    icon: MdOutlineAttachMoney,
  },
  {
    category: "Technology",
    jobs: 436,
    icon: BsLaptop,
  },
  {
    category: "Engineering",
    jobs: 542,
    icon: MdOutlineEngineering,
  },
  {
    category: "Business",
    jobs: 211,
    icon: FaBusinessTime,
  },
  {
    category: "Human Resource",
    jobs: 346,
    icon: HiOutlineUserGroup,
  },
];
const Category = () => {
  return (
    <section className="w-full pt-18">
      <div className="container">
        <div className=" flex flex-col gap-12">
          <div className="flex items-end gap-10 justify-between">
            <Text variant={"h2"} fontFamily={"clash"}>
              Explore by <span className="text-accent-blue">category</span>
            </Text>
            <LinkButton href="/category">Show all jobs</LinkButton>
          </div>
          <div className="grid grid-cols-4 gap-8">
            {jobCategories.map((item) => (
              <CtgCard key={item.category} category={item} />
            ))}
            {/* <CtgCard category="Design" /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

const CtgCard = ({
  category,
}: {
  category: {
    category: string;
    jobs: number;
    icon: IconType;
  };
}) => {
  const Icon = category.icon;

  return (
    <div className="group flex flex-col gap-8 p-8 border border-neutral-20 hover:bg-primary transition-colors">
      <Icon className="text-[48px] text-primary group-hover:text-white" />
      <div className="flex flex-col gap-3">
        <Text
          variant={"title_lg"}
          fontFamily={"clash"}
          className="text-neutral-100 group-hover:text-white"
        >
          {category.category}
        </Text>

        <div className="flex items-center gap-4">
          <Text
            variant={"body_lg"}
            className="text-neutral-60 group-hover:text-white"
          >
            {category.jobs} jobs available
          </Text>

          <span className="text-neutral-100 group-hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M19.75 11.7261L4.75 11.7261"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.7002 5.70149L19.7502 11.7255L13.7002 17.7505"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Category;

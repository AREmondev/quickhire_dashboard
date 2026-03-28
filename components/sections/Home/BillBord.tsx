import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import Image from "next/image";
import React from "react";

const BillBord = () => {
  return (
    <div className="flex items-start py-18">
      <div className="container relative bg-primary">
        <div className="h-[414px] w-full px-[70px]">
          <div className="max-w-[364px] flex flex-col gap-6 justify-center h-full">
            <Text variant={"h2"} fontFamily={"clash"} className="text-white">
              Start posting jobs today
            </Text>
            <Text variant={"body_md"} className="text-white">
              Start posting jobs for only $10.
            </Text>
            <Button className="w-fit" variant={"white"}>
              Sign Up For Free
            </Button>
          </div>
        </div>
        <div className="absolute right-[70px] bottom-0">
          <Image
            src="/assets/images/bashboard.png"
            width={570}
            height={414}
            alt="billboard"
          />
        </div>
        <span className="absolute left-0 top-0 h-32 w-50 transform -rotate-35 bg-white translate-x-[-50%] translate-y-[-50%]"></span>
        <span className="absolute right-0 bottom-0 h-32 w-50 transform -rotate-35 bg-white -translate-x-[-50%] -translate-y-[-50%]"></span>
      </div>
    </div>
  );
};

export default BillBord;

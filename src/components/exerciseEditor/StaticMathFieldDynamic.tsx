"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, type BoxProps } from "@chakra-ui/react";

const BaseStaticMathField = dynamic(
  () => import("react-mathquill").then((mod) => mod.StaticMathField),
  {
    ssr: false,
    loading: () => <span aria-hidden="true" />,
  }
);

interface StaticMathFieldProps extends BoxProps {
  latex?: string;
}

export const StaticMathField = ({ latex, ...props }: StaticMathFieldProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    import("react-mathquill").then((mq) => {
      if (mq.addStyles) mq.addStyles();
    });
  }, []);

  if (!isMounted) return <span aria-hidden="true" />;

  return (
    <Box display="inline-flex" alignItems="center" {...props}>
      <BaseStaticMathField>{latex}</BaseStaticMathField>
    </Box>
  );
};

export default StaticMathField;
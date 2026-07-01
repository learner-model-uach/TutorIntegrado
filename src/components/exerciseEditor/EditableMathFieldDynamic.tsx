"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, type BoxProps } from "@chakra-ui/react";

const MathQuillBase = dynamic(() => import("react-mathquill").then(mod => mod.EditableMathField), {
  ssr: false,
  loading: () => <Box height="40px" bg="bg.muted" borderRadius="md" className="mq-loading" />,
});

interface EditableMathFieldProps extends BoxProps {
  latex?: string;
  onChange?: (mathField: any) => void;
  config?: any;
}

export const EditableMathField = React.forwardRef<HTMLDivElement, EditableMathFieldProps>(
  ({ latex, onChange, config, ...props }, ref) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
      import("react-mathquill").then(mq => {
        if (mq.addStyles) mq.addStyles();
      });
    }, []);

    return (
      <Box
        ref={ref}
        {...props}
        css={{
          "& .mq-editable-field": {
            width: "100%",
            minHeight: "40px",
            display: "flex",
            alignItems: "center",
            padding: "{spacing.2} {spacing.3}",
            borderRadius: "{radii.md}",
            border: "1px solid",
            borderColor: "border.default",
            backgroundColor: "bg.panel",
            transition: "background 50ms ease, border-color 50ms ease",
          },
          "& .mq-focused": {
            outline: "none",
            borderColor: "focusRing",
            boxShadow: "0 0 0 1px var(--colors-focusRing)",
          },
          ...props.css,
        }}
      >
        {/* Only render the MathQuill field after client hydration */}
        {isMounted && <MathQuillBase latex={latex} onChange={onChange} config={config} />}
      </Box>
    );
  },
);

EditableMathField.displayName = "EditableMathField";
export default EditableMathField;

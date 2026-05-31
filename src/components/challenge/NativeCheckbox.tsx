import React from "react";

interface NativeCheckboxProps {
  checked: boolean;
  onChange: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const NativeCheckbox = ({ checked, onChange, children, style = {} }: NativeCheckboxProps) => (
  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      marginBottom: "8px",
      width: "fit-content",
      ...style,
    }}
    onClick={e => e.stopPropagation()}
  >
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "16px",
        height: "16px",
        minWidth: "16px",
        borderRadius: "3px",
        border: checked ? "2px solid transparent" : "2px solid #A0AEC0",
        backgroundColor: checked ? "#3182CE" : "transparent",
        transition: "all 0.2s",
      }}
    >
      {checked && (
        <svg
          width="10"
          height="8"
          viewBox="0 0 10 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      style={{ display: "none" }}
    />
    {children && <span style={{ fontSize: "14px" }}>{children}</span>}
  </label>
);

export default NativeCheckbox;
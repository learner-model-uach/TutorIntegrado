import React from "react";
import styles from './CircularProgressBar.module.css'
interface CircularProgressBarProps {
    progress1: number;
    progress2: number;
    strokeWidth: number;
    size: number;
}
const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
    progress1,
    progress2,
    strokeWidth =5,
    size = 45,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset1 = (circumference - (progress1 / 100) * circumference).toFixed(0);
    const offset2 = (circumference - (progress2 / 100) * circumference);
    return (
        <svg className={styles.circularprogress} width={size} height={size}>
            <circle
                className={styles.circular}
                strokeWidth={strokeWidth}
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            <circle
                className={styles.progress1}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset1}
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            <circle
                className={styles.progress2}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset2}
                r={radius}
                cx={size / 2}
                cy={size/2}
            />
            <text
                x = {size/2}
                y = {size/2}
                textAnchor = "middle"
                dominantBaseline = "middle"
                fontSize={size/3.5}
                fill = "white"
                transform={`rotate(90 ${size / 2} ${size / 2})`}
            >
                {`${(progress1).toFixed(0)}%`}
            </text>
        </svg>
    );
};

export default CircularProgressBar;
import React, { PropsWithChildren } from "react";
import styles from "./Week.module.css";

const WeekDay: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="WeekDay d-flex justify-content-center align-items-center flex-grow-1">
			{children}
		</div>
	);
};

const Week: React.FC = () => {
	return (
		<div className={"d-flex justify-content-around " + styles.Week}>
			<WeekDay>Dom</WeekDay>
			<WeekDay>Seg</WeekDay>
			<WeekDay>Ter</WeekDay>
			<WeekDay>Qua</WeekDay>
			<WeekDay>Qui</WeekDay>
			<WeekDay>Sex</WeekDay>
			<WeekDay>Sáb</WeekDay>
		</div>
	);
};

export default Week;

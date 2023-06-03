import React, {
	MouseEventHandler,
	useRef,
	useState,
	PropsWithChildren,
} from "react";
import { Overlay, Popover, PopoverBody } from "react-bootstrap";
import styles from "./Day.module.css";

interface DayProps {
	notThisMonth?: boolean;
	thisDay?: boolean;
	onClick?: MouseEventHandler<HTMLDivElement>;
}

const Day: React.FC<PropsWithChildren<DayProps>> = ({
	children,
	thisDay,
	notThisMonth,
	onClick,
}) => {
	const divRef = useRef<HTMLDivElement>(null);
	const [show, setShow] = useState<boolean>(false);
	return (
		<>
			<div
				className={`${
					styles.Day
				} d-flex justify-content-center align-items-center flex-grow-1 ${
					thisDay && styles.selected
				} ${notThisMonth && styles.month}`}
				ref={divRef}
				onClick={!notThisMonth ? onClick : undefined}
				onMouseEnter={() => !notThisMonth && setShow(true)}
				onMouseLeave={() => !notThisMonth && setShow(false)}
			>
				{children}
			</div>
			<Overlay target={divRef.current} show={show} placement="top">
				{(props) => (
					<Popover {...props}>
						<PopoverBody>
							Clique aqui para entrar nesta data!
						</PopoverBody>
					</Popover>
				)}
			</Overlay>
		</>
	);
};

export default Day;

export interface IFeedback {
	icon?: string;
	message: string;
	color: string;
}


const FeedbackText: React.FC<{feedback: IFeedback}> = ({feedback}) => {
	return (
		<div className="my-3" style={{ fontSize: "0.9rem" }}>
			<i className={feedback?.icon + " " + feedback.color}></i>
			<span className={feedback.color}> {feedback.message}</span>
		</div>
	);
};

export default FeedbackText;

import React, { useState, useEffect } from "react";
import tooltip from "./tooltip.png";
import good from "./good.png";
import bad from "./bad.png";

function Status() {
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [status, setStatus] = useState([]);

	useEffect(() => {
		fetch("https://www.githubstatus.com/api/v2/summary.json")
			.then((res) => res.json())
			.then(
				(result) => {
					setIsLoaded(true);
					setStatus(result);
				},
				(error) => {
					setIsLoaded(true);
					setError(error);
				}
			);
	}, []);

	//  For some reason, github puts a message in their API
	//  to refer users to their website. The message is useless.
	//  The loop below removes it.
	for (let i in status.components) {
		if (
			status.components[i].name ===
			"Visit www.githubstatus.com for more information"
		) {
			delete status.components[i];
		}
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	} else if (!isLoaded) {
		return <div>Loading...</div>;
	} else {
		return (
			<div>
				<div className="container">
					<h1 className="page-header">GitHub Systems Status</h1>

					{status.status.description === "All Systems Operational" && (
						<p className="status-good">{status.status.description}</p>
					)}
					{status.status.description !== "All Systems Operational" && (
						<p className="status-bad">Some systems are experiencing issues</p>
					)}
					<div className="services-container">
						{status.components.map((item) => (
							<div key={item.id} className="service">
								<div className="service-name">
									{item.name}
									{!!item.description && (
										<div className="tooltip">
											<img src={tooltip} alt="more info" />
											<span className="tooltip-text">{item.description}</span>
										</div>
									)}
								</div>
								{item.status.toLowerCase() === "operational" && (
									<img src={good} alt="Operational" />
								)}
								{item.status.toLowerCase() !== "operational" && (
									<img src={bad} alt=" Not Operational" />
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
}

export default Status;

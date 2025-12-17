import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const OrderStatusChart = () => {
	const { t } = useTranslation();
	const { orderHistory } = useSelector((store) => store.order);

	const orderStatuses = orderHistory.map((item) => item.orderStatus);

	const getOrderCount = (arr, value) =>
		arr.filter((item) => item === value).length;

	const placed = getOrderCount(orderStatuses, "orderPlaced");
	const processing = getOrderCount(orderStatuses, "processing");
	const shipped = getOrderCount(orderStatuses, "shipped");
	const delivered = getOrderCount(orderStatuses, "delivered");

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: t("OrderStatusChart.title"),
			},
		},
	};

	const data = {
		labels: [
			t("OrderStatusChart.status.orderPlaced"),
			t("OrderStatusChart.status.processing"),
			t("OrderStatusChart.status.shipped"),
			t("OrderStatusChart.status.delivered"),
		],
		datasets: [
			{
				label: t("OrderStatusChart.datasetLabel"),
				data: [placed, processing, shipped, delivered],
				backgroundColor: "#191a3ed6",
			},
		],
	};

	return <Bar options={options} data={data} />;
};

export default OrderStatusChart;
